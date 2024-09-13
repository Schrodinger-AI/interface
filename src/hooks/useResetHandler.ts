import { useModal } from '@ebay/nice-modal-react';
import AdoptActionModal from 'components/AdoptActionModal';
import { useCallback } from 'react';
import { useGetAllBalance } from './useGetAllBalance';
import { TSGRToken } from 'types/tokens';
import { useGetTokenPrice, useTokenPrice } from './useAssets';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { ZERO } from 'constants/misc';
import useLoading from './useLoading';
import { rerollSGR } from 'contract/schrodinger';
import { Status } from 'components/ResultModal';
import { resetSGRMessage } from 'constants/promptMessage';
import { useRouter, useSearchParams } from 'next/navigation';
import PromptModal from 'components/PromptModal';
import { checkAllowanceAndApprove } from 'utils/aelfUtils';
import { AdoptActionErrorCode } from './Adopt/adopt';
import { useWalletService } from './useWallet';
import { getDomain, getOriginSymbol } from 'utils';
import { timesDecimals } from 'utils/calculate';
import useIntervalGetSchrodingerDetail from './Adopt/useIntervalGetSchrodingerDetail';
import { store } from 'redux/store';
import { getAdoptErrorMessage } from './Adopt/getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import { AdTracker } from 'utils/ad';
import { renameSymbol } from 'utils/renameSymbol';
import { TModalTheme } from 'components/CommonModal';
import CardResultModal from 'components/CardResultModal';
import useTelegram from './useTelegram';

export const useResetHandler = () => {
  const resetModal = useModal(AdoptActionModal);
  const cardResultModal = useModal(CardResultModal);

  const promptModal = useModal(PromptModal);
  const getAllBalance = useGetAllBalance();
  const { tokenPrice: elfTokenPrice } = useTokenPrice();
  const getTokenPrice = useGetTokenPrice();
  const { showLoading, closeLoading } = useLoading();
  const router = useRouter();
  const { wallet } = useWalletService();
  const { isInTG } = useTelegram();

  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  const intervalFetch = useIntervalGetSchrodingerDetail();

  const approveReset = useCallback(
    async ({
      parentItemInfo,
      amount,
      rankInfo,
      theme = 'light',
    }: {
      parentItemInfo: TSGRToken;
      amount: string;
      rankInfo?: IRankInfo;
      theme?: TModalTheme;
    }): Promise<void> =>
      new Promise((resolve, reject) => {
        promptModal.show({
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
            rank: rankInfo?.rank,
          },
          theme,
          title: 'Pending Approval',
          content: {
            title: 'Go to your wallet',
            content: "You'll be asked to approve this offer from your wallet",
          },
          initialization: async () => {
            try {
              const { schrodingerSideAddress: contractAddress, curChain: chainId } =
                store.getState().info.cmsInfo || {};
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
              const domain = getDomain();

              await rerollSGR({
                symbol: parentItemInfo.symbol,
                amount: timesDecimals(amount, parentItemInfo.decimals).toFixed(0),
                domain,
              });
              promptModal.hide();
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      }),
    [promptModal, wallet.address],
  );

  const showResultModal = useCallback(
    ({
      status,
      parentItemInfo,
      amount,
      rankInfo,
      theme = 'light',
      prePage,
    }: {
      status: Status;
      parentItemInfo: TSGRToken;
      amount: string;
      rankInfo?: IRankInfo;
      theme?: TModalTheme;
      prePage?: string;
    }) => {
      const originSymbol = getOriginSymbol(parentItemInfo.symbol);
      const successBtnText = originSymbol ? `View ${renameSymbol(originSymbol)}` : 'View';

      if (status === Status.SUCCESS) {
        AdTracker.trackEvent('reroll', {
          generation: parentItemInfo.tokenName,
          address: wallet.address,
          user_id: wallet.address,
        });
        if (isInTG) {
          AdTracker.trackEvent('tg_reroll', {
            generation: parentItemInfo.tokenName,
            address: wallet.address,
            user_id: wallet.address,
          });
        }
      }

      cardResultModal.show({
        modalTitle: status === Status.ERROR ? resetSGRMessage.error.title : resetSGRMessage.success.title,
        theme,
        info: {
          name: parentItemInfo.tokenName,
          symbol: renameSymbol(parentItemInfo.symbol),
          generation: parentItemInfo.generation,
        },
        symbol: renameSymbol(parentItemInfo.symbol),
        image: parentItemInfo.inscriptionImageUri,
        id: 'sgr-reset-modal',
        status: status,
        description: status === Status.ERROR ? resetSGRMessage.error.description : resetSGRMessage.success.description,
        onCancel: () => {
          cardResultModal.hide();
        },
        buttonInfo: {
          btnText: status === Status.ERROR ? resetSGRMessage.error.button : successBtnText,
          openLoading: true,
          onConfirm: async () => {
            if (status === Status.ERROR) {
              cardResultModal.hide();
              try {
                await approveReset({
                  parentItemInfo,
                  amount,
                  theme,
                });
                promptModal.hide();
                showResultModal({
                  status: Status.SUCCESS,
                  parentItemInfo,
                  amount,
                  theme,
                  prePage,
                });
              } catch (error) {
                promptModal.hide();
                const _error = getAdoptErrorMessage(error);
                singleMessage.error(_error);

                showResultModal({
                  status: Status.ERROR,
                  parentItemInfo,
                  amount,
                  theme,
                  prePage,
                });
              }
            } else {
              if (originSymbol) {
                await intervalFetch.start(originSymbol);
                intervalFetch.remove();
                cardResultModal.hide();
                router.replace(
                  `/detail?symbol=${originSymbol}&from=my&address=${wallet.address}&source=${source}&prePage=${prePage}`,
                );
              } else {
                router.replace('/');
              }
            }
          },
        },
      });
    },
    [cardResultModal, wallet.address, isInTG, approveReset, promptModal, intervalFetch, router, source],
  );

  return useCallback(
    async ({
      parentItemInfo,
      account,
      rankInfo,
      theme,
      prePage,
    }: {
      parentItemInfo: TSGRToken;
      account: string;
      rankInfo?: IRankInfo;
      theme?: TModalTheme;
      prePage?: string;
    }) => {
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
          theme,
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: renameSymbol(parentItemInfo.symbol),
            rank: rankInfo?.rank,
          },
          inputProps: {
            max: symbolBalance,
            decimals: parentItemInfo.decimals,
          },
          balanceList: [
            {
              amount: symbolBalance,
              suffix: renameSymbol(parentItemInfo.symbol) || '',
              usd: `${symbolBalance && parentPrice ? ZERO.plus(symbolBalance).times(parentPrice).toFixed(2) : '--'}`,
            },
            {
              amount: elfBalance,
              suffix: AELF_TOKEN_INFO.symbol,
              usd: `${elfBalance && elfTokenPrice ? ZERO.plus(elfBalance).times(elfTokenPrice).toFixed(2) : '--'}`,
            },
          ],
          onConfirm: async (amount: string) => {
            resetModal.hide();
            try {
              await approveReset({
                parentItemInfo,
                amount,
                rankInfo,
                theme,
              });
              promptModal.hide();
              showResultModal({
                status: Status.SUCCESS,
                parentItemInfo,
                amount,
                rankInfo,
                theme,
                prePage,
              });
            } catch (error) {
              promptModal.hide();
              showResultModal({
                status: Status.ERROR,
                parentItemInfo,
                amount,
                rankInfo,
                theme,
                prePage,
              });
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
