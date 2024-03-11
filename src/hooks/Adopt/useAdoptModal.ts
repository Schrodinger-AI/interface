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

const useAdoptHandler = () => {
  const adoptActionModal = useModal(AdoptActionModal);

  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);
  const adoptNextModal = useModal(AdoptNextModal);
  const asyncModal = useModal(SyncAdoptModal);

  const { tokenPrice: ELFPrice } = useTokenPrice(AELF_TOKEN_INFO.symbol);
  const { txFee: commonTxFee } = useTxFee();

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
        const [symbolBalance, ELFBalance] = await getParentBalance({
          symbol: parentItemInfo.symbol,
          account,
          decimals: parentItemInfo.decimals,
        });
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
    [ELFPrice, adoptActionModal, getParentBalance],
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
          title: 'Pending Approval',
          content: {
            title: 'Go to your wallet',
            content: "You'll be asked to approve this offer from your wallet",
          },
          initialization: async () => {
            try {
              const adoptId = await adoptStep1Handler({
                params: {
                  parent: parentItemInfo.symbol,
                  amount,
                  domain: location.host,
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
    [promptModal],
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

  const adoptConfirmHandler = useCallback(
    async (params: { adoptId: string; image: string }) => {
      return new Promise(async (resolve, reject) => {
        const imageSignature = await fetchWaterImages(params);
        const confirmParams = { ...params, signature: imageSignature.signature };
        try {
          const result = await adoptStep2Handler(confirmParams);
          adoptActionModal.hide();
          resolve(result);
        } catch (error) {
          adoptActionModal.hide();
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
                resolve(result);
              },
            },
          });
        }
      });
    },
    [adoptActionModal, resultModal],
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
      await adoptConfirmHandler({
        adoptId,
        image: selectItem,
      });
    },
    [adoptConfirmHandler, adoptConfirmInput],
  );

  const adoptConfirmSuccess = useCallback(
    async () =>
      new Promise((resolve) => {
        resultModal.show({
          modalTitle: 'You have failed create tier 2 operational domain',
          info: {
            name: 'name',
          },
          status: Status.SUCCESS,
          description:
            'If you find an element of your interface requires instructions, then you need to redesign it.If you find an element of your interface requires instructions, then you need to redesign it.If you find an element of your interface requires instructions, then you need to redesign it.If you find an element of your interface requires instructions, then you need to redesign it',
          link: {
            href: 'llll',
          },
          onCancel: resolve,
        });
      }),
    [resultModal],
  );

  return useCallback(
    async (parentItemInfo: TSGRToken, account: string) => {
      try {
        const parentPrice = await getTokenPrice(parentItemInfo.symbol);
        const amount = await adoptInput(parentItemInfo, account, parentPrice);
        const adoptId = await approveAdopt({ amount, account, parentItemInfo });
        const infos = await fetchImages(adoptId);
        await approveAdoptConfirm({ infos, adoptId, parentItemInfo, account });
        await adoptConfirmSuccess();
      } catch (error) {
        console.log(error, 'error==');
        if (error === AdoptActionErrorCode.cancel) return;
        const errorMessage = getAdoptErrorMessage(error, 'adopt error');
        singleMessage.error(errorMessage);
      }
    },
    [adoptConfirmSuccess, adoptInput, approveAdopt, approveAdoptConfirm, fetchImages, getTokenPrice],
  );
};

export default useAdoptHandler;
