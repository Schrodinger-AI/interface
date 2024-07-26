'use client';

import { getCatDetail } from 'api/request';
import clsx from 'clsx';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useWalletService } from 'hooks/useWallet';
import { useCallback, useEffect, useState } from 'react';
import { useCmsInfo } from 'redux/hooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { TSGRTokenInfo } from 'types/tokens';
import styles from './style.module.css';
import BalanceModule from './components/BalanceModule';
import IntroText from './components/IntroText';
import AdoptModule from './components/AdoptModule';
import { DIRECT_ADOPT_GEN9_MIN, GEN0_SYMBOL } from 'constants/common';
import useBalanceService from './hooks/useBalanceService';
import { divDecimals } from 'utils/calculate';
import { useModal } from '@ebay/nice-modal-react';
import TipsModal from 'components/TipsModal';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { BUY_SGR_URL } from 'constants/router';

export default function TgHome() {
  const adoptHandler = useAdoptHandler();
  const { wallet } = useWalletService();
  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const { isLogin } = useGetLoginStatus();
  const cmsInfo = useCmsInfo();
  const { sgrBalance } = useBalanceService();
  const { jumpToPage } = useJumpToPage();
  const tipsModal = useModal(TipsModal);

  const getDetail = useCallback(async () => {
    if (wallet.address && !isLogin) return;
    try {
      const result = await getCatDetail({
        symbol: GEN0_SYMBOL,
        chainId: cmsInfo?.curChain || '',
        address: wallet.address,
      });
      setSchrodingerDetail(result);
    } catch (error) {
      /* empty */
    }
  }, [cmsInfo?.curChain, isLogin, wallet.address]);

  const OpenAdoptModal = () => {
    if (!wallet.address || !schrodingerDetail) return;
    if (divDecimals(sgrBalance, 8).lt(DIRECT_ADOPT_GEN9_MIN)) {
      tipsModal.show({
        innerText: `Insufficient funds, deposit a minimum of ${DIRECT_ADOPT_GEN9_MIN}$SGR to adopt a cat.`,
        btnText: 'Buy $SGR',
        onConfirm: () => {
          jumpToPage({ link: BUY_SGR_URL, linkType: 'link' });
          tipsModal.hide();
        },
        theme: 'dark',
      });
      return;
    }
    adoptHandler({
      parentItemInfo: schrodingerDetail,
      account: wallet.address,
      isDirect: true,
      theme: 'dark',
    });
  };

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  return (
    <div className={clsx('flex flex-col max-w-[2560px] w-full min-h-screen px-4 py-6', styles.pageContainer)}>
      <BalanceModule />
      <div className="mt-10">
        <IntroText />
      </div>
      <div className="mt-10">
        <AdoptModule onAdopt={OpenAdoptModal} cId={schrodingerDetail?.collectionId || ''} />
      </div>
    </div>
  );
}
