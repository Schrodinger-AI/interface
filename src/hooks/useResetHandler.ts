import { useModal } from '@ebay/nice-modal-react';
import AdoptActionModal from 'components/AdoptActionModal';
import { useCallback } from 'react';
import { useGetAllBalance } from './useGetAllBalance';
import { TSGRToken } from 'types/tokens';
import { useGetTokenPrice, useTokenPrice } from './useAssets';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { ZERO } from 'constants/misc';
import useLoading from './useLoading';
import { resetSGR } from 'contract/schrodinger';
import ResultModal, { Status } from 'components/ResultModal';
import { resetSGRMessage } from 'constants/promptMessage';
import { useRouter } from 'next/navigation';
import PromptModal from 'components/PromptModal';
import { checkAllowanceAndApprove } from 'utils/aelfUtils';
import { useCmsInfo } from 'redux/hooks';
import { AdoptActionErrorCode } from './Adopt/adopt';
import { useWalletService } from './useWallet';

export const useResetHandler = () => {
  const resetModal = useModal(AdoptActionModal);
  const resultModal = useModal(ResultModal);
  const promptModal = useModal(PromptModal);
  const getAllBalance = useGetAllBalance();
  const { tokenPrice: elfTokenPrice } = useTokenPrice();
  const getTokenPrice = useGetTokenPrice();
  const { showLoading, closeLoading } = useLoading();
  const router = useRouter();
  const cmsInfo = useCmsInfo();
  const { wallet } = useWalletService();

  const approveReset = useCallback(
    async (parentItemInfo: TSGRToken, amount: string): Promise<void> =>
      new Promise(() => {
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
              const { schrodingerSideAddress: contractAddress, curChain: chainId } = cmsInfo || {};
              if (!contractAddress || !chainId) throw AdoptActionErrorCode.missingParams;

              const check = await checkAllowanceAndApprove({
                spender: contractAddress,
                address: wallet.address,
                chainId,
                symbol: parentItemInfo.symbol,
                decimals: parentItemInfo.decimals,
                amount,
              });

              if (!check) throw AdoptActionErrorCode.approveFailed;
              await resetSGR({
                symbol: parentItemInfo.symbol,
                amount: Number(amount),
                // domain: location.host, // 'schrodingerai.com',
                // TODO
                domain: 'schrodingerai.com',
              });
              promptModal.hide();
              return Promise.resolve();
            } catch (error) {
              return Promise.reject(error);
            }
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      }),
    [promptModal],
  );

  const showResultModal = useCallback(
    (status: Status, parentItemInfo: TSGRToken, amount: string) => {
      resultModal.show({
        modalTitle: status === Status.ERROR ? resetSGRMessage.error.title : resetSGRMessage.success.title,
        info: {
          name: parentItemInfo.tokenName,
          logo: parentItemInfo.inscriptionImage,
          subName: parentItemInfo.symbol,
          tag: `GEN ${parentItemInfo.generation}`,
        },
        id: 'sgr-reset-modal',
        status: status,
        description: status === Status.ERROR ? resetSGRMessage.error.description : resetSGRMessage.success.description,
        onCancel: () => {
          resultModal.hide();
        },
        buttonInfo: {
          btnText: status === Status.ERROR ? resetSGRMessage.error.button : resetSGRMessage.success.button,
          isRetry: true,
          openLoading: true,
          onConfirm: async () => {
            resultModal.hide();
            if (status === Status.ERROR) {
              approveReset(parentItemInfo, amount);
            } else {
              router.push('/');
            }
          },
        },
      });
    },
    [approveReset, resultModal, router],
  );

  return useCallback(
    async (parentItemInfo: TSGRToken, account: string) => {
      showLoading();
      let parentPrice: string | undefined = undefined;
      try {
        parentPrice = await getTokenPrice(parentItemInfo.symbol);
      } catch (error) {
        console.log('getTokenPrice', error);
      }

      try {
        const [symbolBalance, elfBalance] = await getAllBalance([parentItemInfo, AELF_TOKEN_INFO], account);
        closeLoading();
        resetModal.show({
          isReset: true,
          modalTitle: 'Reroll Cat',
          info: {
            logo: parentItemInfo.inscriptionImage,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
          },
          inputProps: {
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
              amount: elfBalance,
              suffix: AELF_TOKEN_INFO.symbol,
              usd: `${elfBalance && elfTokenPrice ? ZERO.plus(elfBalance).times(elfTokenPrice).toFixed(2) : '--'}`,
            },
          ],
          onConfirm: async (amount: string) => {
            console.log('amount', amount);
            resetModal.hide();
            try {
              await approveReset(parentItemInfo, amount);
              promptModal.hide();
              showResultModal(Status.SUCCESS, parentItemInfo, amount);
            } catch (error) {
              promptModal.hide();
              showResultModal(Status.ERROR, parentItemInfo, amount);
            }
          },
        });
      } catch (error) {
        closeLoading();
      }
    },
    [
      approveReset,
      closeLoading,
      elfTokenPrice,
      getAllBalance,
      getTokenPrice,
      promptModal,
      resetModal,
      showLoading,
      showResultModal,
    ],
  );
};
