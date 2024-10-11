'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useCmsInfo } from 'redux/hooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import useTelegram from 'hooks/useTelegram';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { PortkeyAssetProvider, Asset, did } from '@portkey/did-ui-react';
// import { LoginStatusEnum } from '@portkey/types'; // TODO: login acceleration

export default function MyAsset() {
  const router = useRouter();
  const { walletInfo, disConnectWallet } = useConnectWallet();
  const { isLogin } = useGetLoginStatus();
  const { isInTG } = useTelegram();

  const { isShowRampBuy = true, isShowRampSell = true } = useCmsInfo() || {};

  useEffect(() => {
    if (!isInTG && !isLogin) {
      router.push('/');
    }
  }, [isInTG, isLogin, router]);

  // const isLoginOnChain = did.didWallet.isLoginStatus === LoginStatusEnum.SUCCESS; // TODO: login acceleration

  if (!isLogin) {
    return null;
  }

  return (
    <div className={styles.asset}>
      <PortkeyAssetProvider
        originChainId={walletInfo?.extraInfo?.portkeyInfo?.chainId as Chain}
        pin={walletInfo?.extraInfo?.portkeyInfo?.pin}>
        <Asset
          isShowRamp={isShowRampBuy || isShowRampSell}
          isShowRampBuy={isShowRampBuy}
          isShowRampSell={isShowRampSell}
          // isLoginOnChain={isLoginOnChain} // TODO: login acceleration
          backIcon={<LeftOutlined reversed={undefined} />}
          onOverviewBack={() => {
            router.back();
          }}
          onDeleteAccount={() => {
            disConnectWallet();
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
