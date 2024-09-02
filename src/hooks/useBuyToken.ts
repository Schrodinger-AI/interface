import { useCheckLoginAndToken, useWalletService } from './useWallet';
import { BUY_ELF_URL, BUY_SGR_URL } from 'constants/router';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';
import PurchaseMethodModal from 'components/PurchaseMethodModal';
import { TModalTheme } from 'components/CommonModal';
import { useGetAllBalance } from './useGetAllBalance';
import { AELF_TOKEN_INFO, GEN0_SYMBOL_INFO } from 'constants/assets';

export type TBuyType = 'buySGR' | 'buyELF';

export const useBuyToken = () => {
  const { checkLogin } = useCheckLoginAndToken();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const purchaseMethodModal = useModal(PurchaseMethodModal);
  const getAllBalance = useGetAllBalance();
  const { wallet } = useWalletService();

  const buyToken = useCallback(
    async ({ type, theme = 'light' }: { type: TBuyType; theme?: TModalTheme }) => {
      setLoading(true);
      const [symbolBalance, elfBalance] = await getAllBalance([GEN0_SYMBOL_INFO, AELF_TOKEN_INFO], wallet.address);
      console.log('=====balance', symbolBalance, elfBalance);
      if ((type === 'buySGR' && elfBalance !== '0') || (type === 'buyELF' && symbolBalance !== '0')) {
        console.log('=====modal');
        purchaseMethodModal.show({
          type: type,
          theme,
          onConfirmCallback: () => {
            setLoading(false);
          },
        });
      } else {
        router.push(type === 'buySGR' ? BUY_SGR_URL : BUY_ELF_URL);
      }
      setLoading(false);
    },
    [getAllBalance, purchaseMethodModal, router, wallet.address],
  );

  const checkBalanceAndJump = useCallback(
    ({ type, theme = 'light' }: { type: TBuyType; theme?: TModalTheme }) => {
      if (!isLogin) {
        checkLogin({
          onSuccess: () => {
            buyToken({ type, theme });
          },
        });

        return;
      }
      buyToken({ type, theme });
    },
    [checkLogin, buyToken, isLogin],
  );

  return { checkBalanceAndJump, loading };
};
