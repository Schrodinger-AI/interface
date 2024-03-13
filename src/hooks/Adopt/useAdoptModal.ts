import { useModal } from '@ebay/nice-modal-react';
import PromptModal from 'components/PromptModal';
import { useCallback } from 'react';
import { adoptStep1Handler, adoptStep2Handler, fetchTraitsAndImages, fetchWaterImages } from './AdoptStep';
import AdoptActionModal from 'components/AdoptActionModal';
import { AdoptActionErrorCode } from './adopt';
import { getAdoptErrorMessage } from './getErrorMessage';
import ResultModal, { Status } from 'components/ResultModal';
import { singleMessage } from '@portkey/did-ui-react';
import AdoptNextModal from 'components/AdoptNextModal';
import { TSGRToken } from 'types/tokens';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { useGetTokenPrice, useTokenPrice, useTxFee } from 'hooks/useAssets';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { ONE, ZERO } from 'constants/misc';
import { useGetAllBalance } from 'hooks/useGetAllBalance';
import useLoading from 'hooks/useLoading';
import { adopt1Message, promptContentTitle } from 'constants/promptMessage';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { getDomain, getExploreLink } from 'utils';
import { ISendResult } from 'types';
import { useCmsInfo } from 'redux/hooks';

const useAdoptHandler = () => {
  const adoptActionModal = useModal(AdoptActionModal);
  const { walletType } = useWebLogin();

  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);
  const adoptNextModal = useModal(AdoptNextModal);
  const asyncModal = useModal(SyncAdoptModal);
  const { showLoading, closeLoading } = useLoading();

  const { tokenPrice: ELFPrice } = useTokenPrice(AELF_TOKEN_INFO.symbol);
  const { txFee: commonTxFee } = useTxFee();

  const cmsInfo = useCmsInfo();

  const getTokenPrice = useGetTokenPrice();
  const getAllBalance = useGetAllBalance();

  const getParentBalance = useCallback(
    ({ symbol, decimals, account }: { symbol: string; decimals: number; account: string }) =>
      getAllBalance([{ symbol, decimals }, AELF_TOKEN_INFO], account),
    [getAllBalance],
  );

  const adoptInput = useCallback(
    (parentItemInfo: TSGRToken, account: string, parentPrice?: string): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        showLoading();
        let symbolBalance;
        let ELFBalance;
        try {
          const [symbolB, ELFB] = await getParentBalance({
            symbol: parentItemInfo.symbol,
            account,
            decimals: parentItemInfo.decimals,
          });
          symbolBalance = symbolB;
          ELFBalance = ELFB;
        } finally {
          closeLoading();
        }

        adoptActionModal.show({
          modalTitle: 'Adopt Next-Gen Cat',
          info: {
            logo: parentItemInfo.inscriptionImage,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
          },

          inputProps: {
            min: ONE.div(`1e${parentItemInfo.decimals}`).toFixed(),
            max: symbolBalance,
            decimals: parentItemInfo.decimals,
          },
          balanceList: [
            {
              amount: symbolBalance,
              suffix: parentItemInfo.symbol,
              usd: `${symbolBalance && parentPrice ? ZERO.plus(symbolBalance).times(parentPrice).toFixed(2) : '--'}`,
            },
            {
              amount: ELFBalance,
              suffix: AELF_TOKEN_INFO.symbol,
              usd: `${ELFBalance && ELFPrice ? ZERO.plus(ELFBalance).times(ELFPrice).toFixed(2) : '--'}`,
            },
          ],
          onClose: () => {
            adoptActionModal.hide();

            reject(AdoptActionErrorCode.cancel);
          },
          onConfirm: (amount: string) => {
            adoptActionModal.hide();
            resolve(amount as string);
          },
        });
      });
    },
    [ELFPrice, adoptActionModal, closeLoading, getParentBalance, showLoading],
  );

  const approveAdopt = useCallback(
    async ({
      amount,
      parentItemInfo,
      account,
    }: {
      account: string;
      amount: string;
      parentItemInfo: TSGRToken;
    }): Promise<string> =>
      new Promise((resolve, reject) => {
        promptModal.show({
          info: {
            logo: parentItemInfo.inscriptionImage,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
          },
          title: adopt1Message.prompt.title,
          content: {
            title: promptContentTitle,
            content:
              walletType === WalletType.portkey ? [adopt1Message.prompt.portkey] : [adopt1Message.prompt.default],
          },
          initialization: async () => {
            try {
              const domain = getDomain();

              const adoptId = await adoptStep1Handler({
                params: {
                  parent: parentItemInfo.symbol,
                  amount,
                  domain,
                },
                address: account,
                decimals: parentItemInfo.decimals,
              });
              promptModal.hide();
              resolve(adoptId);
            } catch (error) {
              console.log(error, 'error===');
              if (error === AdoptActionErrorCode.missingParams) {
                reject(error);
                return;
              }
              if (error === AdoptActionErrorCode.approveFailed) throw error;
              const errorMessage = getAdoptErrorMessage(error, 'adopt error');
              singleMessage.error(errorMessage);
              throw error;
            }
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      }),
    [promptModal, walletType],
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

  const adoptConfirmInput = useCallback(
    async (infos: IAdoptImageInfo, parentItemInfo: TSGRToken, account: string): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        const [symbolBalance, ELFBalance] = await getParentBalance({
          symbol: parentItemInfo.symbol,
          account,
          decimals: parentItemInfo.decimals,
        });

        adoptNextModal.show({
          data: {
            SGRToken: {
              tokenName: parentItemInfo.tokenName,
              symbol: parentItemInfo.symbol,
              amount: symbolBalance,
            },
            newTraits: infos.adoptImageInfo.attributes,
            images: infos.adoptImageInfo.images,
            inheritedTraits: parentItemInfo.traits,
            transaction: {
              txFee: ZERO.plus(commonTxFee).toFixed(),
              usd: `${commonTxFee && ELFPrice ? ZERO.plus(commonTxFee).times(ELFPrice).toFixed(2) : '--'}`,
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
    async (confirmParams: {
      adoptId: string;
      image: string;
      signature: string;
    }): Promise<{ txResult: ISendResult; image: string }> =>
      new Promise(async (resolve, reject) => {
        try {
          const result = await adoptStep2Handler(confirmParams);
          resolve({ txResult: result, image: confirmParams.image });
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
              name: 'SGR',
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
                resolve({ txResult: result, image: confirmParams.image });

                resultModal.hide();
              },
            },
          });
        }
      }),
    [promptModal, resultModal],
  );

  const adoptConfirmHandler = useCallback(
    async (params: {
      adoptId: string;
      image: string;
      parentItemInfo: TSGRToken;
    }): Promise<{
      txResult: ISendResult;
      image: string;
    }> => {
      return new Promise(async (resolve, reject) => {
        const parentItemInfo = params.parentItemInfo;
        showLoading();
        const imageSignature = await fetchWaterImages(params);
        adoptNextModal.hide();
        closeLoading();
        if (imageSignature?.error) {
          reject(imageSignature?.error);
          return;
        }
        const signature = imageSignature.signature;
        const image = imageSignature.image;

        const confirmParams = {
          adoptId: params.adoptId,
          image: image,
          signature: Buffer.from(signature, 'hex').toString('base64'),
        };

        promptModal.show({
          info: {
            logo: parentItemInfo.inscriptionImage,
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
            const result = await retryAdoptConfirm(confirmParams);
            resolve(result);
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      });
    },
    [adoptNextModal, closeLoading, promptModal, retryAdoptConfirm, showLoading],
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

      // console.log(selectItem, 'selectItem=');
      return await adoptConfirmHandler({
        adoptId,
        image: selectItem,
        parentItemInfo,
      });
    },
    [adoptConfirmHandler, adoptConfirmInput],
  );

  const adoptConfirmSuccess = useCallback(
    async ({ transactionId, image, name }: { transactionId: string; image: string; name: string }) =>
      new Promise((resolve) => {
        const explorerUrl = getExploreLink(transactionId, 'transaction', cmsInfo?.curChain);
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
          onCancel: () => {
            resolve(true);
            resultModal.hide();
          },
        });
      }),
    [cmsInfo, resultModal],
  );

  return useCallback(
    async (parentItemInfo: TSGRToken, account: string) => {
      try {
        showLoading();
        const parentPrice = await getTokenPrice(parentItemInfo.symbol);
        closeLoading();
        const amount = await adoptInput(parentItemInfo, account, parentPrice);
        const adoptId = await approveAdopt({ amount, account, parentItemInfo });
        const infos = await fetchImages(adoptId);
        const { txResult, image } = await approveAdoptConfirm({ infos, adoptId, parentItemInfo, account });
        await adoptConfirmSuccess({ transactionId: txResult.TransactionId, image, name: parentItemInfo.tokenName });
      } catch (error) {
        console.log(error, 'error==');
        if (error === AdoptActionErrorCode.cancel) return;
        const errorMessage = getAdoptErrorMessage(error, 'adopt error');
        singleMessage.error(errorMessage);
      }
    },
    [
      adoptConfirmSuccess,
      adoptInput,
      approveAdopt,
      approveAdoptConfirm,
      closeLoading,
      fetchImages,
      getTokenPrice,
      showLoading,
    ],
  );
};

export default useAdoptHandler;
