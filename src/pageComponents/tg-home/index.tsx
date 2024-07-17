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

export default function TgHome() {
  const adoptHandler = useAdoptHandler();
  const { wallet } = useWalletService();
  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const { isLogin } = useGetLoginStatus();
  const cmsInfo = useCmsInfo();

  const getDetail = useCallback(async () => {
    if (wallet.address && !isLogin) return;
    try {
      const result = await getCatDetail({ symbol: 'SGR-1', chainId: cmsInfo?.curChain || '', address: wallet.address });
      setSchrodingerDetail(result);
    } catch (error) {
      /* empty */
    }
  }, [cmsInfo?.curChain, isLogin, wallet.address]);

  const OpenAdoptModal = () => {
    if (!wallet.address || !schrodingerDetail) return;
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
        <AdoptModule onAdopt={OpenAdoptModal} />
      </div>
      {/* <Button onClick={OpenAdoptModal} disabled={!wallet.address || !schrodingerDetail}>
        Adopt
      </Button> */}
    </div>
  );
}
