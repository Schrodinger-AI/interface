import { useModal } from '@ebay/nice-modal-react';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { useCallback } from 'react';
import {
  IAdoptNextInfo,
  adoptStep2Handler,
  fetchTraitsAndImages,
  fetchWaterImages,
  getAdoptConfirmEventLogs,
} from './AdoptStep';
import { ITrait, TSGRToken } from 'types/tokens';
import { ZERO } from 'constants/misc';
import AdoptNextModal from 'components/AdoptNextModal';
import { AELF_TOKEN_INFO, POINTS_COEFFICIENT } from 'constants/assets';
import { useGetAllBalance } from 'hooks/useGetAllBalance';
import { useTokenPrice, useTxFee } from 'hooks/useAssets';
import { AdoptActionErrorCode } from './adopt';
import PromptModal from 'components/PromptModal';
import { IContractError, ISendResult } from 'types';
import { getAdoptErrorMessage } from './getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import useIntervalGetSchrodingerDetail from './useIntervalGetSchrodingerDetail';
import { getExploreLink } from 'utils';
import { store } from 'redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { divDecimals } from 'utils/calculate';
import { message } from 'antd';
import { DEFAULT_ERROR, formatErrorMsg } from 'utils/formatError';
import { MethodType, SentryMessageType, captureMessage } from 'utils/captureMessage';
import { formatTraits } from 'utils/formatTraits';
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useWalletService } from 'hooks/useWallet';
import { renameSymbol } from 'utils/renameSymbol';
import CardResultModal, { Status } from 'components/CardResultModal';
import { ISGRTokenInfoProps } from 'components/SGRTokenInfo';
import { formatTokenPrice } from 'utils/format';
import { TModalTheme } from 'components/CommonModal';
import { useGetImageAndConfirm } from './useGetImageAndConfirm';

export const useAdoptConfirm = () => {
  const asyncModal = useModal(SyncAdoptModal);
  const adoptNextModal = useModal(AdoptNextModal);
  const cardResultModal = useModal(CardResultModal);

  const { txFee: commonTxFee } = useTxFee();
  const { tokenPrice: ELFPrice } = useTokenPrice(AELF_TOKEN_INFO.symbol);
  const promptModal = useModal(PromptModal);
  const intervalFetch = useIntervalGetSchrodingerDetail();
  const router = useRouter();
  const { wallet } = useWalletService();
  const getImageAndConfirm = useGetImageAndConfirm();

  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  const getAllBalance = useGetAllBalance();

  const getParentBalance = useCallback(
    ({ symbol, decimals, account }: { symbol: string; decimals: number; account: string }) =>
      getAllBalance([{ symbol, decimals }, AELF_TOKEN_INFO], account),
    [getAllBalance],
  );

  const adoptConfirmInput = useCallback(
    async ({
      infos,
      parentItemInfo,
      childrenItemInfo,
      account,
      rankInfo,
      isDirect,
      theme,
      adoptOnly = false,
    }: {
      infos: IAdoptImageInfo;
      parentItemInfo: TSGRToken;
      childrenItemInfo: IAdoptNextInfo;
      account: string;
      isDirect?: boolean;
      rankInfo?: IRankInfo;
      theme?: TModalTheme;
      adoptOnly?: boolean;
    }): Promise<{
      selectImage: string;
      getWatermarkImage: boolean;
      SGRTokenInfo?: ISGRTokenInfoProps;
    }> => {
      return new Promise(async (resolve, reject) => {
        try {
          const [, ELFBalance] = await getParentBalance({
            symbol: parentItemInfo.symbol,
            account,
            decimals: parentItemInfo.decimals,
          });

          const isAcross = ZERO.plus(parentItemInfo.generation).plus(1).lt(infos.adoptImageInfo.generation);

          adoptNextModal.show({
            isAcross,
            isDirect,
            theme,
            data: {
              SGRToken: {
                tokenName: childrenItemInfo.tokenName,
                symbol: childrenItemInfo.symbol,
                amount: divDecimals(childrenItemInfo.outputAmount, parentItemInfo.decimals).toFixed(),
                rankInfo: rankInfo,
              },
              allTraits: infos.adoptImageInfo.attributes,
              images: adoptOnly ? [infos.adoptImageInfo.boxImage] : [infos.imageUri],
              inheritedTraits: parentItemInfo.traits,
              transaction: {
                txFee: ZERO.plus(commonTxFee).toFixed(),
                usd: `${commonTxFee && ELFPrice ? ZERO.plus(commonTxFee).times(ELFPrice).toFixed(4) : '--'}`,
              },
              ELFBalance: {
                amount: ELFBalance,
                usd: `${ELFBalance && ELFPrice ? ZERO.plus(ELFBalance).times(ELFPrice).toFixed(2) : '--'}`,
              },
            },
            adoptId: childrenItemInfo.adoptId,
            onClose: () => {
              adoptNextModal.hide();
              reject(AdoptActionErrorCode.cancel);
            },
            onConfirm: async (selectImage, getWatermarkImage, SGRTokenInfo) => {
              if (getWatermarkImage) {
                resolve({
                  selectImage: selectImage,
                  getWatermarkImage,
                  SGRTokenInfo,
                });
              } else {
                getImageAndConfirm({
                  parentItemInfo,
                  childrenItemInfo: {
                    adoptId: childrenItemInfo.adoptId,
                    outputAmount: childrenItemInfo.outputAmount,
                    symbol: childrenItemInfo.symbol,
                    tokenName: childrenItemInfo.tokenName,
                    inputAmount: childrenItemInfo.inputAmount,
                    isDirect: false,
                  },
                  theme,
                  adoptOnly: false,
                });
              }
            },
          });
        } catch (error) {
          reject(error);
        }
      });
    },
    [ELFPrice, adoptNextModal, commonTxFee, getImageAndConfirm, getParentBalance],
  );

  const retryAdoptConfirm = useCallback(
    async (
      confirmParams: {
        adoptId: string;
        outputAmount: string | number;
        symbol: string;
        tokenName: string;
        image: string;
        imageUri: string;
        signature: string;
      },
      parentItemInfo: TSGRToken,
      theme?: TModalTheme,
    ): Promise<{
      txResult: ISendResult;
      image: string;
      imageUri: string;
    }> =>
      new Promise(async (resolve, reject) => {
        try {
          const result = await adoptStep2Handler(confirmParams);
          resolve({
            txResult: result,
            ...confirmParams,
          });
          promptModal.hide();
        } catch (error) {
          promptModal.hide();

          captureMessage({
            type: SentryMessageType.CONTRACT,
            params: {
              name: 'adoptStep2Handler',
              method: MethodType.CALLSENDMETHOD,
              query: confirmParams,
              description: error,
            },
          });

          console.log(error, 'error===');
          if (error === AdoptActionErrorCode.missingParams) throw error;

          const errorMessage = getAdoptErrorMessage(error, 'adopt confirm error');
          singleMessage.error(errorMessage);

          cardResultModal.show({
            modalTitle: 'You have failed minted!',
            theme,
            amount: divDecimals(confirmParams.outputAmount, parentItemInfo.decimals).toFixed(),
            status: Status.ERROR,
            buttonInfo: {
              btnText: 'Try Again',
              openLoading: true,
              onConfirm: async () => {
                const result = await adoptStep2Handler(confirmParams);
                resolve({
                  txResult: result,
                  ...confirmParams,
                });

                cardResultModal.hide();
              },
            },
            hideButton: false,
            image: confirmParams.image,
            info: {
              name: confirmParams.tokenName,
              symbol: confirmParams.symbol,
              generation: confirmParams?.tokenName?.split('GEN')[1],
            },
            onCancel: () => {
              reject(AdoptActionErrorCode.cancel);
              cardResultModal.hide();
            },
          });
        }
      }),
    [cardResultModal, promptModal],
  );

  const adoptConfirmHandler = useCallback(
    async ({
      childrenItemInfo,
      image: originImage,
      parentItemInfo,
      rankInfo,
      getWatermarkImage,
      infos,
      theme = 'light',
      isDirect,
    }: {
      childrenItemInfo: IAdoptNextInfo;
      image: string;
      parentItemInfo: TSGRToken;
      rankInfo?: IRankInfo;
      getWatermarkImage?: boolean;
      infos: IAdoptImageInfo;
      theme?: TModalTheme;
      isDirect?: boolean;
    }): Promise<{
      txResult: ISendResult;
      image: string;
      imageUri: string;
    }> => {
      return new Promise(async (resolve, reject) => {
        if (getWatermarkImage) {
          // showLoading();
          const imageSignature = await fetchWaterImages({
            adoptId: childrenItemInfo.adoptId,
            image: originImage,
          });
          adoptNextModal.hide();
          // closeLoading();
          if (imageSignature?.error || !imageSignature.signature) {
            reject(imageSignature?.error || 'Failed to obtain watermark image');
            captureMessage({
              type: SentryMessageType.HTTP,
              params: {
                name: 'fetchWaterImages',
                method: 'post',
                query: {
                  adoptId: childrenItemInfo.adoptId,
                  image: originImage,
                },
                description: imageSignature,
              },
            });
            return;
          }

          const signature = imageSignature.signature;
          const image = imageSignature.image;
          const imageUri = imageSignature.imageUri;

          const confirmParams = {
            adoptId: childrenItemInfo.adoptId,
            outputAmount: childrenItemInfo.outputAmount,
            symbol: childrenItemInfo.symbol,
            tokenName: childrenItemInfo.tokenName,
            image: image,
            imageUri: imageUri,
            signature: Buffer.from(signature, 'hex').toString('base64'),
          };

          const generation = childrenItemInfo?.tokenName?.split('GEN')[1];

          promptModal.show({
            info: {
              logo: originImage,
              name: childrenItemInfo.tokenName,
              tag: generation ? `GEN ${parentItemInfo.generation}` : '',
              subName: renameSymbol(childrenItemInfo.symbol),
            },
            title: 'Pending Approval',
            theme,
            content: {
              title: 'Go to your wallet',
              content: "You'll be asked to approve this offer from your wallet",
            },
            initialization: async () => {
              const result = await retryAdoptConfirm(confirmParams, parentItemInfo, theme);
              resolve(result);
            },
            onClose: () => {
              promptModal.hide();
            },
          });
        } else {
          adoptNextModal.hide();
          getImageAndConfirm({
            parentItemInfo: parentItemInfo,
            childrenItemInfo: {
              adoptId: childrenItemInfo.adoptId,
              outputAmount: childrenItemInfo.outputAmount,
              symbol: childrenItemInfo.symbol,
              tokenName: childrenItemInfo.tokenName,
              inputAmount: childrenItemInfo.inputAmount,
              isDirect,
            },
            theme,
            adoptOnly: false,
          });
        }
      });
    },
    [adoptNextModal, getImageAndConfirm, promptModal, retryAdoptConfirm],
  );

  const fetchImages = useCallback(
    async ({
      adoptId,
      adoptOnly,
      transactionHash,
      theme = 'light',
    }: {
      adoptId: string;
      adoptOnly: boolean;
      transactionHash?: string;
      theme?: TModalTheme;
    }) => {
      asyncModal.show({
        theme,
      });
      const result = await fetchTraitsAndImages(adoptId, adoptOnly, transactionHash);
      asyncModal.hide();
      return result;
    },
    [asyncModal],
  );

  const approveAdoptConfirm = useCallback(
    async ({
      infos,
      childrenItemInfo,
      parentItemInfo,
      account,
      rankInfo,
      isDirect,
      theme,
      adoptOnly,
    }: {
      infos: IAdoptImageInfo;
      childrenItemInfo: IAdoptNextInfo;
      parentItemInfo: TSGRToken;
      account: string;
      rankInfo?: IRankInfo;
      isDirect?: boolean;
      theme?: TModalTheme;
      adoptOnly?: boolean;
    }) => {
      const params = await adoptConfirmInput({
        infos,
        parentItemInfo,
        childrenItemInfo,
        account,
        rankInfo,
        isDirect,
        theme,
        adoptOnly,
      });

      if (params) {
        const { selectImage, SGRTokenInfo, getWatermarkImage } = params;

        const { txResult, imageUri } = await adoptConfirmHandler({
          image: selectImage,
          parentItemInfo,
          childrenItemInfo,
          rankInfo,
          getWatermarkImage,
          infos,
          theme,
          isDirect,
        });
        let nextTokenName = '';
        let nextSymbol = '';

        try {
          const { tokenName, symbol } = await getAdoptConfirmEventLogs(txResult.TransactionResult);
          nextTokenName = tokenName;
          nextSymbol = symbol;
        } catch (error) {
          //
        }
        // Get next gen symbol
        return {
          image: imageUri,
          txResult,
          nextTokenName,
          nextSymbol,
          SGRTokenInfo,
        };
      } else {
        return undefined;
      }
    },
    [adoptConfirmHandler, adoptConfirmInput],
  );

  const adoptConfirmSuccess = useCallback(
    async ({
      transactionId,
      image,
      name,
      symbol,
      rankInfo,
      SGRTokenInfo,
      inputAmount,
      isDirect = false,
      theme = 'light',
      prePage,
    }: {
      transactionId: string;
      image: string;
      name: string;
      symbol: string;
      rankInfo?: TRankInfoAddLevelInfo;
      SGRTokenInfo?: ISGRTokenInfoProps;
      inputAmount: number | string;
      isDirect?: boolean;
      theme?: TModalTheme;
      prePage?: string;
    }) =>
      new Promise((resolve) => {
        const cmsInfo = store.getState().info.cmsInfo;
        const explorerUrl = getExploreLink(transactionId, 'transaction', cmsInfo?.curChain);
        const generation = name.split('GEN')[1];
        const points = inputAmount
          ? `${formatTokenPrice(
              ZERO.plus(inputAmount).multipliedBy(
                isDirect ? POINTS_COEFFICIENT['XPSGR-5-Direct'] : POINTS_COEFFICIENT['XPSGR-5'],
              ),
            )} XPSGR-5`
          : undefined;

        cardResultModal.show({
          modalTitle: rankInfo?.levelInfo?.describe
            ? "Congrats! You've got a rare cat!"
            : "Congrats! You've got a new cat!",
          amount: SGRTokenInfo?.amount,
          status: Status.SUCCESS,
          theme,
          link: {
            href: explorerUrl,
          },
          showScrap: generation === '9',
          showLight: generation === '9' && rankInfo?.levelInfo?.describe ? true : false,
          buttonInfo: {
            btnText: `View Inscription`,
            openLoading: true,
            onConfirm: async () => {
              await intervalFetch.start(symbol);
              intervalFetch.remove();
              cardResultModal.hide();
              router.replace(
                `/detail?symbol=${symbol}&from=my&address=${wallet.address}&source=${source}&prePage=${prePage}`,
              );
            },
          },
          hideButton: false,
          image,
          info: {
            name,
            symbol,
            generation,
            rank: rankInfo?.rank,
            points,
            levelInfo: rankInfo?.levelInfo,
          },
          onCancel: () => {
            resolve(true);
            intervalFetch.remove();
            cardResultModal.hide();
          },
        });
      }),
    [cardResultModal, intervalFetch, router, source, wallet.address],
  );

  const getRankInfo = useCallback(
    async (allTraits: ITrait[]) => {
      const traits = formatTraits(allTraits);
      if (!traits) {
        return;
      }
      const catsRankProbability = await getCatsRankProbability({
        catsTraits: [traits],
        address: addPrefixSuffix(wallet.address),
      });

      const info = (catsRankProbability && catsRankProbability?.[0]) || undefined;

      return info;
    },
    [wallet.address],
  );

  const adoptConfirm = useCallback(
    async ({
      parentItemInfo,
      childrenItemInfo,
      account,
      theme = 'light',
      adoptOnly = true,
      prePage,
    }: {
      parentItemInfo: TSGRToken;
      childrenItemInfo: IAdoptNextInfo;
      account: string;
      adoptOnly?: boolean;
      theme?: TModalTheme;
      prePage?: string;
    }) => {
      try {
        const infos = await fetchImages({
          adoptId: childrenItemInfo.adoptId,
          adoptOnly,
          transactionHash: childrenItemInfo.transactionHash,
          theme,
        });

        const rankInfo = await getRankInfo(infos.adoptImageInfo.attributes);

        const result = await approveAdoptConfirm({
          infos,
          childrenItemInfo,
          parentItemInfo,
          account,
          rankInfo,
          theme,
          adoptOnly,
          isDirect: childrenItemInfo.isDirect,
        });

        if (result) {
          const { txResult, image, nextTokenName, nextSymbol, SGRTokenInfo } = result;
          await adoptConfirmSuccess({
            transactionId: txResult.TransactionId,
            image,
            theme,
            name: nextTokenName,
            symbol: nextSymbol,
            rankInfo,
            SGRTokenInfo,
            isDirect: childrenItemInfo.isDirect,
            inputAmount: divDecimals(childrenItemInfo.inputAmount, parentItemInfo.decimals).toFixed(),
            prePage,
          });
        }
      } catch (error) {
        if (error === AdoptActionErrorCode.cancel) {
          return;
        }
        message.error(
          typeof error === 'string'
            ? error
            : formatErrorMsg(error as IContractError).errorMessage.message || DEFAULT_ERROR,
        );
      }
    },
    [adoptConfirmSuccess, approveAdoptConfirm, fetchImages, getRankInfo],
  );

  return adoptConfirm;
};
