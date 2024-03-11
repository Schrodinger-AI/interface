import { useModal } from '@ebay/nice-modal-react';
import PromptModal from 'components/PromptModal';
import { useCallback } from 'react';
import { adoptStep1Handler, adoptStep2Handler, fetchTraitsAndImages } from './AdoptStep';
import AdoptActionModal from 'components/AdoptActionModal';
import { AdoptActionErrorCode } from './adopt';
import { getAdoptErrorMessage } from './getErrorMessage';
import ResultModal, { Status } from 'components/ResultModal';
import { sleep } from 'utils';
import { singleMessage } from '@portkey/did-ui-react';

const useAdoptHandler = () => {
  const adoptActionModal = useModal(AdoptActionModal);

  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);

  const adoptInput = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      adoptActionModal.show({
        modalTitle: 'Adopt Next Generation Item',
        info: {
          name: 'name',
          // logo: '',
          subName: 'ssss',
          // tag: 'GEN 1',
        },
        onClose: () => {
          adoptActionModal.hide();

          reject(AdoptActionErrorCode.cancel);
        },
        onConfirm: (amount: string) => {
          adoptActionModal.hide();
          resolve(amount as string);
        },
        inputProps: {
          min: '0.00000001',
          max: '1000',
          decimals: 8,
        },
        balanceList: [
          {
            amount: '200 SGR-G',
            suffix: 'sss',
            usd: '222',
          },
          {
            amount: '200 SGR-G',
            suffix: 'sss',
            usd: '222',
          },
        ],
      });
    });
  }, [adoptActionModal]);

  const approveAdopt = useCallback(
    async ({ amount }: { amount: string }): Promise<string> =>
      new Promise((resolve, reject) => {
        promptModal.show({
          info: {
            name: 'name',
            subName: 'subName',
          },
          title: 'Pending Approval',
          content: {
            title: 'content title',
            content: 'content content',
          },
          initialization: async () => {
            try {
              const adoptId = await adoptStep1Handler({
                params: {
                  parent: '',
                  amount,
                  domain: '',
                },
                address: '',
                decimals: 8,
              });
              promptModal.hide();
              resolve(adoptId);
            } catch (error) {
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
      promptModal.show({
        info: {
          name: 'name',
          subName: 'subName',
        },
        title: 'getMessage',
        content: {
          title: 'content title',
          content: 'content content',
        },
      });
      const result = await fetchTraitsAndImages(adoptId);
      promptModal.hide();
      return result;
    },
    [promptModal],
  );

  const adoptConfirmInput = useCallback(
    (infos: ISchrodingerImages, adoptId: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        adoptActionModal.show({
          modalTitle: 'Adopt Next Generation Item',
          info: {
            name: 'name',
            // logo: '',
            subName: 'ssss',
            // tag: 'GEN 1',
          },
          onClose: () => {
            adoptActionModal.hide();

            reject(AdoptActionErrorCode.cancel);
          },
          onConfirm: (imageInfo) => {
            // adoptActionModal.hide();
            // : { image: string; signature: string }
            resolve({ image: 'string', signature: 'signature' });
          },
          inputProps: {
            min: '0.00000001',
            max: '1000',
            decimals: 8,
          },
          balanceList: [
            {
              amount: '200 SGR-G',
              suffix: 'sss',
              usd: '222',
            },
            {
              amount: '200 SGR-G',
              suffix: 'sss',
              usd: '222',
            },
          ],
        });
      });
    },
    [adoptActionModal],
  );

  const adoptConfirmHandler = useCallback(
    async (params: { adoptId: string; image: string; signature: string }) => {
      return new Promise(async (resolve, reject) => {
        try {
          await sleep(1000);
          const result = await adoptStep2Handler(params);
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
                const result = await adoptStep2Handler(params);
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
    async (infos: ISchrodingerImages, adoptId: string) => {
      const { image, signature } = await adoptConfirmInput(infos, adoptId);
      await adoptConfirmHandler({
        adoptId,
        image,
        signature,
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

  return useCallback(async () => {
    try {
      adoptConfirmHandler({} as any);
      const amount = await adoptInput();
      const adoptId = await approveAdopt({ amount });
      const infos = await fetchImages(adoptId);
      await approveAdoptConfirm(infos, adoptId);
      await adoptConfirmSuccess();
    } catch (error) {
      console.log(error, 'error==');
      if (error === AdoptActionErrorCode.cancel) return;
      const errorMessage = getAdoptErrorMessage(error, 'adopt error');
      singleMessage.error(errorMessage);
    }
  }, [adoptConfirmHandler, adoptConfirmSuccess, adoptInput, approveAdopt, approveAdoptConfirm, fetchImages]);
};

export default useAdoptHandler;
