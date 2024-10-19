import { useModal } from '@ebay/nice-modal-react';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { useCallback } from 'react';
import { IAdoptNextInfo, adoptStep2Handler, fetchTraitsAndImages, getAdoptConfirmEventLogs } from './AdoptStep';
import { ITrait, TSGRToken } from 'types/tokens';
import { ZERO } from 'constants/misc';
import AdoptNextModal from 'components/AdoptNextModal';
import { POINTS_COEFFICIENT } from 'constants/assets';
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
import { AIServerError, DEFAULT_ERROR, formatErrorMsg } from 'utils/formatError';
import { MethodType, SentryMessageType, captureMessage } from 'utils/captureMessage';
import { formatTraits } from 'utils/formatTraits';
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { renameSymbol } from 'utils/renameSymbol';
import CardResultModal, { Status } from 'components/CardResultModal';
import { ISGRTokenInfoProps } from 'components/SGRTokenInfo';
import { formatTokenPrice } from 'utils/format';
import { TModalTheme } from 'components/CommonModal';
import { checkAIService } from 'api/request';
import useLoading from 'hooks/useLoading';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export const useGetImageAndConfirm = () => {
  const asyncModal = useModal(SyncAdoptModal);
  const adoptNextModal = useModal(AdoptNextModal);
  const cardResultModal = useModal(CardResultModal);

  const promptModal = useModal(PromptModal);
  const intervalFetch = useIntervalGetSchrodingerDetail();
  const router = useRouter();
  const { walletInfo } = useConnectWallet();

  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  const { showLoading, closeLoading } = useLoading();

  const fetchImages = useCallback(
    async ({
      adoptId,
      transactionHash,
      theme = 'light',
      adoptOnly,
      faction,
    }: {
      adoptId: string;
      transactionHash?: string;
      theme?: TModalTheme;
      adoptOnly: boolean;
      faction?: string;
    }) => {
      asyncModal.show({
        theme,
      });
      const result = await fetchTraitsAndImages({
        adoptId,
        adoptOnly,
        address: walletInfo?.address || '',
        transactionHash,
        faction,
      });
      asyncModal.hide();
      return result;
    },
    [asyncModal, walletInfo?.address],
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
      infos,
      theme = 'light',
    }: {
      childrenItemInfo: IAdoptNextInfo;
      image: string;
      parentItemInfo: TSGRToken;
      rankInfo?: IRankInfo;
      infos: IAdoptImageInfo;
      theme?: TModalTheme;
    }): Promise<{
      txResult: ISendResult;
      image: string;
      imageUri: string;
    }> => {
      return new Promise(async (resolve, reject) => {
        adoptNextModal.hide();
        const confirmParams = {
          adoptId: childrenItemInfo.adoptId,
          outputAmount: childrenItemInfo.outputAmount,
          symbol: childrenItemInfo.symbol,
          tokenName: childrenItemInfo.tokenName,
          image: infos.image,
          imageUri: infos.imageUri,
          signature: infos.signature ? Buffer.from(infos.signature, 'hex').toString('base64') : '',
        };

        const generation = childrenItemInfo?.tokenName?.split('GEN')[1];

        promptModal.show({
          info: {
            logo: originImage,
            name: childrenItemInfo.tokenName,
            tag: generation ? `GEN ${generation}` : '',
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
      });
    },
    [adoptNextModal, promptModal, retryAdoptConfirm],
  );

  const approveAdoptConfirm = useCallback(
    async ({
      infos,
      childrenItemInfo,
      parentItemInfo,
      rankInfo,
      theme,
    }: {
      infos: IAdoptImageInfo;
      childrenItemInfo: IAdoptNextInfo;
      parentItemInfo: TSGRToken;
      rankInfo?: IRankInfo;
      theme?: TModalTheme;
    }) => {
      const { txResult, imageUri } = await adoptConfirmHandler({
        image: infos.imageUri,
        parentItemInfo,
        childrenItemInfo,
        rankInfo,
        infos,
        theme,
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
      };
    },
    [adoptConfirmHandler],
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
      onSuccessModalCloseCallback,
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
      onSuccessModalCloseCallback?: () => void;
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

        const describeRarity = rankInfo?.levelInfo?.describe ? rankInfo?.levelInfo?.describe.split(',')[0] : '';

        cardResultModal.show({
          modalTitle:
            rankInfo?.levelInfo?.describe && describeRarity !== 'Common'
              ? "Congrats! You've got a rare cat!"
              : "Congrats! You've got a new cat!",
          amount: SGRTokenInfo?.amount,
          status: Status.SUCCESS,
          theme,
          link: {
            href: explorerUrl,
          },
          showScrap: generation === '9',
          showLight: generation === '9' && rankInfo?.levelInfo?.describe && describeRarity !== 'Common' ? true : false,
          buttonInfo: {
            btnText: `View Inscription`,
            openLoading: true,
            onConfirm: async () => {
              await intervalFetch.start(symbol);
              intervalFetch.remove();
              cardResultModal.hide();
              router.replace(
                `/detail?symbol=${symbol}&from=my&address=${walletInfo?.address}&source=${source}&prePage=${prePage}`,
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
            onSuccessModalCloseCallback && onSuccessModalCloseCallback();
          },
        });
      }),
    [cardResultModal, intervalFetch, router, source, walletInfo?.address],
  );

  const getRankInfo = useCallback(
    async (allTraits: ITrait[]) => {
      const traits = formatTraits(allTraits);
      if (!traits || !walletInfo?.address) return;
      const catsRankProbability = await getCatsRankProbability({
        catsTraits: [traits],
        address: addPrefixSuffix(walletInfo.address),
      });

      const info = (catsRankProbability && catsRankProbability?.[0]) || undefined;

      return info;
    },
    [walletInfo?.address],
  );

  const checkAIServer = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      const isAIserviceError = await checkAIService();
      if (!isAIserviceError) {
        resolve('continue');
        return;
      }
      asyncModal.show({
        closable: true,
        showLoading: false,
        innerText: AIServerError,
        onCancel: () => {
          asyncModal.hide();
          reject(AdoptActionErrorCode.cancel);
        },
      });
    });
  }, [asyncModal]);

  const getImageAndConfirm = useCallback(
    async ({
      parentItemInfo,
      childrenItemInfo,
      theme = 'light',
      prePage,
      faction,
      onSuccessModalCloseCallback,
    }: {
      parentItemInfo: TSGRToken;
      childrenItemInfo: IAdoptNextInfo;
      adoptOnly?: boolean;
      theme?: TModalTheme;
      prePage?: string;
      faction?: string;
      onSuccessModalCloseCallback?: () => void;
    }) => {
      try {
        showLoading();
        await checkAIServer();
        closeLoading();
        const infos = await fetchImages({
          adoptId: childrenItemInfo.adoptId,
          adoptOnly: false,
          transactionHash: childrenItemInfo.transactionHash,
          theme,
          faction,
        });

        if (!infos) return;

        const rankInfo = await getRankInfo(infos.adoptImageInfo.attributes);

        const { txResult, image, nextTokenName, nextSymbol } = await approveAdoptConfirm({
          infos,
          childrenItemInfo,
          parentItemInfo,
          rankInfo,
          theme,
        });
        const amount = divDecimals(childrenItemInfo.outputAmount, parentItemInfo.decimals).toFixed();

        await adoptConfirmSuccess({
          transactionId: txResult.TransactionId,
          image,
          theme,
          name: nextTokenName,
          symbol: nextSymbol,
          rankInfo,
          SGRTokenInfo: {
            tokenName: nextTokenName,
            symbol: nextSymbol,
            amount,
            rankInfo,
            theme,
          },
          isDirect: childrenItemInfo.isDirect,
          inputAmount: divDecimals(childrenItemInfo.inputAmount, parentItemInfo.decimals).toFixed(),
          prePage,
          onSuccessModalCloseCallback,
        });
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
    [adoptConfirmSuccess, approveAdoptConfirm, checkAIServer, closeLoading, fetchImages, getRankInfo, showLoading],
  );

  return getImageAndConfirm;
};
