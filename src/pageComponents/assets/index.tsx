'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useWebLogin, useComponentFlex } from 'aelf-web-login';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useWalletService } from 'hooks/useWallet';
import { useCmsInfo } from 'redux/hooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import useTelegram from 'hooks/useTelegram';

export default function MyAsset() {
  const router = useRouter();
  const { wallet } = useWebLogin();
  const { logout } = useWalletService();
  const { isLogin } = useGetLoginStatus();
  const { isInTG } = useTelegram();

  const { PortkeyAssetProvider, Asset } = useComponentFlex();
  const { isShowRampBuy = true, isShowRampSell = true } = useCmsInfo() || {};

  useEffect(() => {
    if (!isInTG && !isLogin) {
      router.push('/');
    }
  }, [isInTG, isLogin, router]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className={styles.asset}>
      <PortkeyAssetProvider originChainId={wallet?.portkeyInfo?.chainId as Chain} pin={wallet?.portkeyInfo?.pin}>
        <Asset
          isShowRamp={isShowRampBuy || isShowRampSell}
          isShowRampBuy={isShowRampBuy}
          isShowRampSell={isShowRampSell}
          backIcon={<LeftOutlined reversed={undefined} />}
          onOverviewBack={() => {
            router.back();
          }}
          onDeleteAccount={() => {
            logout();
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
