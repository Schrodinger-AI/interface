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
import { formatTokenPrice } from 'utils/format';

export type TBuyType = 'buySGR' | 'buyELF' | 'buyFISH';

type TProps = {
  type: TBuyType;
  theme?: TModalTheme;
  hideSwap?: boolean;
  hideTutorial?: boolean;
  defaultDescription?: string[];
};

export const useBuyToken = () => {
  const { checkLogin } = useCheckLoginAndToken();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const purchaseMethodModal = useModal(PurchaseMethodModal);
  const getAllBalance = useGetAllBalance();
  const { wallet } = useWalletService();

  const buyToken = useCallback(
    async ({ type, theme = 'light', hideSwap = false, hideTutorial = false, defaultDescription }: TProps) => {
      try {
        setLoading(true);
        const [symbolBalance, elfBalance] = await getAllBalance([GEN0_SYMBOL_INFO, AELF_TOKEN_INFO], wallet.address);
        if (type === 'buyFISH') {
          router.push('/telegram/tasks');
        } else if ((type === 'buySGR' && elfBalance !== '0') || (type === 'buyELF' && symbolBalance !== '0')) {
          purchaseMethodModal.show({
            type: type,
            theme,
            sgrBalance: formatTokenPrice(symbolBalance),
            elfBalance: formatTokenPrice(elfBalance),
            hideSwap,
            hideTutorial,
            defaultDescription,
            onConfirmCallback: () => {
              setLoading(false);
            },
          });
        } else {
          router.push(type === 'buySGR' ? BUY_SGR_URL : BUY_ELF_URL);
        }
      } finally {
        setLoading(false);
      }
    },
    [getAllBalance, purchaseMethodModal, router, wallet.address],
  );

  const checkBalanceAndJump = useCallback(
    (params: TProps) => {
      if (!isLogin) {
        checkLogin({
          onSuccess: () => {
            buyToken(params);
          },
        });

        return;
      }
      buyToken(params);
    },
    [checkLogin, buyToken, isLogin],
  );

  return { checkBalanceAndJump, loading };
};
