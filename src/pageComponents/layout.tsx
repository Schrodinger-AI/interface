'use client';
import React, { useEffect, useMemo } from 'react';
import { Layout as AntdLayout } from 'antd';
import Header from 'components/Header';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';
import { setAdInfo, setIsMobile } from 'redux/reducer/info';
import isMobile from 'utils/isMobile';
import Footer from 'components/Footer';
import { useWalletInit } from 'hooks/useWallet';
import WebLoginInstance from 'contract/webLogin';
import ForestWebLoginInstance from 'contract/forestWebLogin';
import { SupportedELFChainId } from 'types';
import { PAGE_CONTAINER_ID } from 'constants/index';
import { usePathname } from 'next/navigation';
import styles from './style.module.css';
import clsx from 'clsx';
import { useResponsive } from 'hooks/useResponsive';
import useGetCustomTheme from 'redux/hooks/useGetCustomTheme';
import { isWeChatBrowser } from 'utils/isWeChatBrowser';
import WeChatGuide from 'components/WeChatGuide';
import { backgroundStyle } from 'provider/useNavigationGuard';
import WalletAndTokenInfo from 'utils/walletAndTokenInfo';
import { useGetToken } from 'hooks/useGetToken';
import queryString from 'query-string';
import { HIDE_MAIN_PADDING } from 'constants/router';
import VConsole from 'vconsole';
import useTelegram from 'hooks/useTelegram';
import { ContractInstance } from 'forest-ui-react';

import 'forest-ui-react/dist/assets/index.css';

const Layout = dynamic(async () => {
  const { useConnectWallet } = await import('@aelf-web-login/wallet-adapter-react').then((module) => module);
  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;

    const customTheme = useGetCustomTheme();

    const webLoginContext = useConnectWallet();
    const { getToken } = useGetToken();

    const pathname = usePathname();
    const { callSendMethod, callViewMethod } = useConnectWallet();

    const { isInTelegram, isInTG } = useTelegram();

    // ContractInstance.set(WebLoginInstance.get());
    // TODO: After upgrading forest sdk, you can delete the current
    ContractInstance.set(ForestWebLoginInstance.get());

    const isGrayBackground = useMemo(() => {
      return pathname === '/coundown';
    }, [pathname]);

    useEffect(() => {
      if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
        new VConsole();
      }
      // store ad tracker
      const search = queryString.parse(location.search);
      store.dispatch(setAdInfo(search));

      const resize = () => {
        const ua = navigator.userAgent;
        const mobileType = isMobile(ua);
        const isMobileDevice =
          mobileType.apple.phone || mobileType.android.phone || mobileType.apple.tablet || mobileType.android.tablet;
        store.dispatch(setIsMobile(isMobileDevice));
      };
      resize();
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }, []);

    const { isLG } = useResponsive();

    useEffect(() => {
      WebLoginInstance.get().setContractMethod({
        sendMethod: callSendMethod,
        viewMethod: callViewMethod,
      });

      // TODO: After upgrading forest sdk, you can delete the current
      ForestWebLoginInstance.get().setContractMethod([
        {
          chain: SupportedELFChainId.MAIN_NET,
          sendMethod: callSendMethod,
          viewMethod: callViewMethod,
        },
        {
          chain: SupportedELFChainId.TDVV_NET,
          sendMethod: callSendMethod,
          viewMethod: callViewMethod,
        },
        {
          chain: SupportedELFChainId.TDVW_NET,
          sendMethod: callSendMethod,
          viewMethod: callViewMethod,
        },
      ]);
    }, [callSendMethod, callViewMethod, webLoginContext.isConnected]);

    useWalletInit();

    const isHiddenHeader = useMemo(() => {
      return ['/privacy-policy'].includes(pathname);
    }, [pathname]);

    const isHiddenLayout = useMemo(() => {
      return ['/assets'].includes(pathname) || isInTelegram();
    }, [isInTelegram, pathname]);

    useEffect(() => {
      WalletAndTokenInfo.setWallet(webLoginContext.walletType, webLoginContext.walletInfo);
      WalletAndTokenInfo.setSignMethod(getToken);
    }, [getToken, webLoginContext]);

    return (
      <>
        {!isHiddenLayout ? (
          <AntdLayout
            className={clsx(
              'h-full overflow-scroll min-w-[360px] bg-no-repeat bg-cover bg-center',
              customTheme.layout.backgroundStyle,
              isInTG && 'bg-pixelsPageBg',
              isInTG ? styles['scrollbar-dark'] : styles['scrollbar'],
            )}>
            {!isHiddenHeader && <Header />}
            <div id={PAGE_CONTAINER_ID} className="flex-1 overflow-scroll">
              <AntdLayout.Content
                className={`${
                  isLG ? styles['schrodinger-mobile-content'] : styles['schrodinger-content']
                } flex-shrink-0 pb-4 w-full ${isGrayBackground ? 'bg-neutralHoverBg' : ''} ${
                  HIDE_MAIN_PADDING.includes(pathname) ? 'px-0' : 'px-4 lg:px-10'
                }`}>
                {children}
              </AntdLayout.Content>
              <Footer className={isGrayBackground ? 'bg-neutralHoverBg' : ''} />
            </div>
          </AntdLayout>
        ) : (
          <div
            className={clsx(
              isInTG && 'h-full overflow-scroll min-w-[360px] bg-pixelsPageBg',
              isInTG ? styles['scrollbar-dark'] : styles['scrollbar'],
            )}>
            {children}
          </div>
        )}
        <div
          className={clsx(
            'w-[100vw] h-[100vh] absolute top-0 left-0 !bg-cover bg-center bg-no-repeat z-[-1000] invisible',
            backgroundStyle.invitee,
          )}></div>
        <div
          className={clsx(
            'w-[100vw] h-[100vh] absolute top-0 left-0 !bg-cover bg-center bg-no-repeat z-[-1000] invisible',
            backgroundStyle.referral,
          )}></div>
        {isWeChatBrowser() && <WeChatGuide />}
      </>
    );
  };
});

export default Layout;
