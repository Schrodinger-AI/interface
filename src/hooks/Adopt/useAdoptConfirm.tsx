import { useModal } from '@ebay/nice-modal-react';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { useCallback } from 'react';
import { adoptStep2Handler, fetchTraitsAndImages, fetchWaterImages, getAdoptConfirmEventLogs } from './AdoptStep';
import { TSGRToken } from 'types/tokens';
import { ZERO } from 'constants/misc';
import AdoptNextModal from 'components/AdoptNextModal';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { useGetAllBalance } from 'hooks/useGetAllBalance';
import { useTokenPrice, useTxFee } from 'hooks/useAssets';
import { AdoptActionErrorCode } from './adopt';
import PromptModal from 'components/PromptModal';
import { ISendResult } from 'types';
import { getAdoptErrorMessage } from './getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import ResultModal, { Status } from 'components/ResultModal';
import useIntervalGetSchrodingerDetail from './useIntervalGetSchrodingerDetail';
import { getExploreLink } from 'utils';
import { store } from 'redux/store';
import { useRouter } from 'next/navigation';

export const useAdoptConfirm = () => {
  const asyncModal = useModal(SyncAdoptModal);
  const adoptNextModal = useModal(AdoptNextModal);
  const resultModal = useModal(ResultModal);

  const { txFee: commonTxFee } = useTxFee();
  const { tokenPrice: ELFPrice } = useTokenPrice(AELF_TOKEN_INFO.symbol);
  const promptModal = useModal(PromptModal);
  const intervalFetch = useIntervalGetSchrodingerDetail();
  const router = useRouter();

  const getAllBalance = useGetAllBalance();

  const getParentBalance = useCallback(
    ({ symbol, decimals, account }: { symbol: string; decimals: number; account: string }) =>
      getAllBalance([{ symbol, decimals }, AELF_TOKEN_INFO], account),
    [getAllBalance],
  );

  const adoptConfirmInput = useCallback(
    async (infos: IAdoptImageInfo, parentItemInfo: TSGRToken, account: string): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        const [symbolBalance, ELFBalance] = await getParentBalance({
          symbol: parentItemInfo.symbol,
          account,
          decimals: parentItemInfo.decimals,
        });

        const isAcross = ZERO.plus(parentItemInfo.generation).plus(1).lt(infos.adoptImageInfo.generation);

        adoptNextModal.show({
          isAcross,
          data: {
            SGRToken: {
              tokenName: parentItemInfo.tokenName,
              symbol: parentItemInfo.symbol,
              amount: symbolBalance,
            },
            allTraits: infos.adoptImageInfo.attributes,
            images: infos.adoptImageInfo.images,
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

          onClose: () => {
            adoptNextModal.hide();

            reject(AdoptActionErrorCode.cancel);
          },
          onConfirm: (selectImage) => {
            resolve(selectImage);
          },
        });
      });
    },
    [ELFPrice, adoptNextModal, commonTxFee, getParentBalance],
  );

  const retryAdoptConfirm = useCallback(
    async (
      confirmParams: {
        adoptId: string;
        image: string;
        imageUri: string;
        signature: string;
      },
      parentItemInfo: TSGRToken,
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
            image: confirmParams.image,
            imageUri: confirmParams.imageUri,
          });
          promptModal.hide();
        } catch (error) {
          promptModal.hide();

          console.log(error, 'error===');
          if (error === AdoptActionErrorCode.missingParams) throw error;

          const errorMessage = getAdoptErrorMessage(error, 'adopt confirm error');
          singleMessage.error(errorMessage);

          resultModal.show({
            modalTitle: 'You have failed minted!',
            info: {
              name: parentItemInfo.tokenName,
              logo: confirmParams.image,
            },
            id: 'adopt-retry-modal',
            status: Status.ERROR,
            description:
              'Adopt can fail due to network issues, transaction fee increases, because someone else mint the inscription before you.',
            onCancel: () => {
              reject(AdoptActionErrorCode.cancel);
              resultModal.hide();
            },
            buttonInfo: {
              btnText: 'Try Again',
              isRetry: true,
              openLoading: true,
              onConfirm: async () => {
                const result = await adoptStep2Handler(confirmParams);
                resolve({
                  txResult: result,
                  image: confirmParams.image,
                  imageUri: confirmParams.imageUri,
                });

                resultModal.hide();
              },
            },
          });
        }
      }),
    [promptModal, resultModal],
  );

  const adoptConfirmHandler = useCallback(
    async ({
      adoptId,
      image: originImage,
      parentItemInfo,
    }: {
      adoptId: string;
      image: string;
      parentItemInfo: TSGRToken;
    }): Promise<{
      txResult: ISendResult;
      image: string;
      imageUri: string;
    }> => {
      return new Promise(async (resolve, reject) => {
        // showLoading();
        const imageSignature = await fetchWaterImages({
          adoptId,
          image: originImage,
        });
        adoptNextModal.hide();
        // closeLoading();
        if (imageSignature?.error) {
          reject(imageSignature?.error);
          return;
        }
        const signature = imageSignature.signature;
        const image = imageSignature.image;
        const imageUri = imageSignature.imageUri;

        const confirmParams = {
          adoptId,
          image: image,
          imageUri: imageUri,
          signature: Buffer.from(signature, 'hex').toString('base64'),
        };

        promptModal.show({
          info: {
            logo: parentItemInfo.inscriptionImageUri || parentItemInfo.inscriptionImage,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
          },
          title: 'Pending Approval',
          content: {
            title: 'Go to your wallet',
            content: "You'll be asked to approve this offer from your wallet",
          },
          initialization: async () => {
            const result = await retryAdoptConfirm(confirmParams, parentItemInfo);
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

  const fetchImages = useCallback(
    async (adoptId: string) => {
      asyncModal.show();
      const result = await fetchTraitsAndImages(adoptId);
      asyncModal.hide();
      return result;
    },
    [asyncModal],
  );

  const approveAdoptConfirm = useCallback(
    async ({
      infos,
      adoptId,
      parentItemInfo,
      account,
    }: {
      infos: IAdoptImageInfo;
      adoptId: string;
      parentItemInfo: TSGRToken;
      account: string;
    }) => {
      const selectItem = await adoptConfirmInput(infos, parentItemInfo, account);

      const { image, txResult, imageUri } = await adoptConfirmHandler({
        adoptId,
        image: selectItem,
        parentItemInfo,
      });
      let nextTokenName = '';
      let nextSymbol = '';
      console.log(imageUri, 'imageUri==');
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
    [adoptConfirmHandler, adoptConfirmInput],
  );

  const adoptConfirmSuccess = useCallback(
    async ({
      transactionId,
      image,
      name,
      symbol,
    }: {
      transactionId: string;
      image: string;
      name: string;
      symbol: string;
    }) =>
      new Promise((resolve) => {
        const cmsInfo = store.getState().info.cmsInfo;
        const explorerUrl = getExploreLink(transactionId, 'transaction', cmsInfo?.curChain);
        console.log('=====getExploreLink', explorerUrl, transactionId, cmsInfo?.curChain, image);
        resultModal.show({
          modalTitle: 'Cat Successfully Adopted!',
          info: {
            name: name,
            logo: image,
          },
          status: Status.SUCCESS,
          description: `You have successfully minted the inscription ${name}`,
          link: {
            href: explorerUrl,
          },
          buttonInfo: {
            btnText: `View Inscription`,
            openLoading: true,
            onConfirm: async () => {
              await intervalFetch.start(symbol);
              intervalFetch.remove();
              resultModal.hide();
              router.replace(`/detail?symbol=${symbol}`);
            },
          },
          onCancel: () => {
            resolve(true);
            intervalFetch.remove();
            resultModal.hide();
          },
        });
      }),
    [intervalFetch, resultModal, router],
  );

  return useCallback(
    async (parentItemInfo: TSGRToken, adoptId: string, account: string) => {
      const infos = await fetchImages(adoptId);
      const { txResult, image, nextTokenName, nextSymbol } = await approveAdoptConfirm({
        infos,
        adoptId,
        parentItemInfo,
        account,
      });

      await adoptConfirmSuccess({
        transactionId: txResult.TransactionId,
        image,
        name: nextTokenName,
        symbol: nextSymbol,
      });
    },
    [adoptConfirmSuccess, approveAdoptConfirm, fetchImages],
  );
};
