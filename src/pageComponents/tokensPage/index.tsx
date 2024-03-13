'use client';
import { useWalletService } from 'hooks/useWallet';
import TokensInfo from './components/TokensInfo';
import OwnedItems from './components/OwnedItems';
import TokensHome from './components/TokensHome';
import styles from './styles.module.css';

// TODO
// import { useCmsInfo } from 'redux/hooks';
// import { useRouter } from 'next/navigation';
// import { BigNumber } from 'bignumber.js';
// import { useEffect } from 'react';

export default function TokensPage() {
  const { isLogin } = useWalletService();

  // TODO
  // const router = useRouter();
  // const cmsInfo = useCmsInfo();
  // useEffect(() => {
  //   const currentTime = new Date().getTime();
  //   if (BigNumber(cmsInfo?.openTimeStamp || 0).gt(currentTime)) {
  //     router.replace('/coundown');
  //   }
  // }, [cmsInfo?.openTimeStamp, router]);

  return (
    <>
      {!isLogin ? (
        <TokensHome />
      ) : (
        <div className={styles.tokensPageContainer}>
          <TokensInfo />
          <OwnedItems />
        </div>
      )}
    </>
  );
}
