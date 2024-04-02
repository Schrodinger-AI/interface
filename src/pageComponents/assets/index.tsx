'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useWebLogin, useComponentFlex } from 'aelf-web-login';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useWalletService } from 'hooks/useWallet';

export default function MyAsset() {
  const router = useRouter();
  const { wallet } = useWebLogin();
  const { isLogin, logout } = useWalletService();

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
      <PortkeyAssetProvider originChainId={wallet?.portkeyInfo?.chainId as Chain} pin={wallet?.portkeyInfo?.pin}>
        <Asset
          // isShowRamp={info.isShowRampBuy || info.isShowRampSell}
          // isShowRampBuy={info.isShowRampBuy}
          isShowRampSell={false}
          // faucet={{
          //   faucetContractAddress: configInfo?.faucetContractAddress,
          // }}
          backIcon={<LeftOutlined rev={undefined} />}
          onOverviewBack={() => {
            router.back();
          }}
          onDeleteAccount={() => {
            logout();
          }}
          onLifeCycleChange={(lifeCycle: any) => {
            console.log(lifeCycle, 'onLifeCycleChange');
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
