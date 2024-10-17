'use client';

import clsx from 'clsx';
import HeaderModule from './components/HeaderModule';
import CompareModule from './components/CompareModule';
import AdoptModule from './components/AdoptModule';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import { useWalletService } from 'hooks/useWallet';
import useBalanceService from 'pageComponents/tg-home/hooks/useBalanceService';
import { divDecimals } from 'utils/calculate';
import { DIRECT_ADOPT_GEN9_MIN } from 'constants/common';
import { useBuyToken } from 'hooks/useBuyToken';
import { formatTokenPrice } from 'utils/format';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useModal } from '@ebay/nice-modal-react';
import PurchaseMethodModal from 'components/PurchaseMethodModal';

export default function TgHome() {
  const router = useRouter();
  const { wallet } = useWalletService();
  const { schrodingerDetail, voteInfo } = useGetStoreInfo();
  const { refresh } = useBalanceService();
  const { checkBalanceAndJump } = useBuyToken();
  const adoptHandler = useAdoptHandler();
  const purchaseMethodModal = useModal(PurchaseMethodModal);

  const [sgrBalance, setSgrBalance] = useState('0');
  const [elfBalance, setElfBalance] = useState('0');

  const OpenAdoptModal = useCallback(
    (faction: string) => {
      if (voteInfo?.countdown && voteInfo?.countdown > 0) {
        router.back();
        return;
      }
      if (!wallet.address || !schrodingerDetail) return;
      if (divDecimals(sgrBalance, 8).lt(DIRECT_ADOPT_GEN9_MIN)) {
        const description = `Insufficient funds, need more $SGR. The cat adoption costs ${DIRECT_ADOPT_GEN9_MIN} $SGR minimum. `;
        if (divDecimals(elfBalance, 8).gt(0)) {
          checkBalanceAndJump({
            type: 'buySGR',
            theme: 'dark',
            defaultDescription: [description],
          });
        } else {
          purchaseMethodModal.show({
            type: 'buySGR',
            theme: 'dark',
            sgrBalance: formatTokenPrice(sgrBalance),
            elfBalance: formatTokenPrice(elfBalance),
            hideSwap: true,
            hideTutorial: true,
            defaultDescription: [description],
          });
        }

        return;
      }
      adoptHandler({
        parentItemInfo: schrodingerDetail,
        account: wallet.address,
        isDirect: true,
        theme: 'dark',
        prePage: 'adoptModal',
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      adoptHandler,
      checkBalanceAndJump,
      elfBalance,
      purchaseMethodModal,
      schrodingerDetail,
      sgrBalance,
      wallet.address,
      voteInfo?.countdown,
    ],
  );

  const getBalance = useCallback(async () => {
    const res = await refresh();
    if (res) {
      const { sgrBalance, elfBalance } = res;
      setSgrBalance(sgrBalance || '0');
      setElfBalance(elfBalance || '0');
    }
  }, [refresh]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <div className={clsx('max-w-[2560px] w-full min-h-screen px-4 py-6 bg-battaleBg')}>
      <HeaderModule />

      <CompareModule left={200} right={500} />

      <AdoptModule onAdopt={OpenAdoptModal} />
    </div>
  );
}
