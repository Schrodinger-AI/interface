'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletType, useWebLogin, useComponentFlex } from 'aelf-web-login';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useWalletService } from 'hooks/useWallet';
// import { useSelector } from 'redux/store';

export default function MyAsset() {
  const router = useRouter();
  const { wallet, walletType, login } = useWebLogin();
  const { isLogin } = useWalletService();

  // const info = useSelector((store) => store.elfInfo.elfInfo);

  // const { isShowRampBuy, isShowRampSell } = info;

  //TODO:
  const info = {
    isShowRampBuy: true,
    isShowRampSell: false,
  };

  const { PortkeyAssetProvider, Asset } = useComponentFlex();

  useEffect(() => {
    if (!isLogin) {
      router.push('/');
    }
  }, [isLogin, router]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className={styles.asset}>
      <PortkeyAssetProvider
        originChainId={wallet?.portkeyInfo?.chainId as Chain}
        pin={wallet?.portkeyInfo?.pin}
      >
        <Asset
          isShowRamp={info.isShowRampBuy || info.isShowRampSell}
          isShowRampBuy={info.isShowRampBuy}
          isShowRampSell={info.isShowRampSell}
          // faucet={{
          //   faucetContractAddress: configInfo?.faucetContractAddress,
          // }}
          backIcon={<LeftOutlined rev={undefined} />}
          onOverviewBack={() => router.back()}
          onLifeCycleChange={(lifeCycle: any) => {
            console.log(lifeCycle, 'onLifeCycleChange');
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
