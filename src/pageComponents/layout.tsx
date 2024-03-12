'use client';
import React, { useEffect } from 'react';
import { Layout as AntdLayout } from 'antd';
import Header from 'components/Header';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';
import { setIsMobile } from 'redux/reducer/info';
import isMobile from 'utils/isMobile';
import Footer from 'components/Footer';
import { useBroadcastChannel, useWalletInit } from 'hooks/useWallet';
import WebLoginInstance from 'contract/webLogin';
import { SupportedELFChainId } from 'types';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import SafeArea from 'components/SafeArea';

const Layout = dynamic(async () => {
  const { WebLoginState, useWebLogin, useCallContract, WebLoginEvents, useWebLoginEvent } = await import(
    'aelf-web-login'
  ).then((module) => module);
  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;

    const { cmsInfo } = useGetStoreInfo();

    const webLoginContext = useWebLogin();

    const { callSendMethod: callAELFSendMethod, callViewMethod: callAELFViewMethod } = useCallContract({
      chainId: SupportedELFChainId.MAIN_NET,
      rpcUrl: cmsInfo?.rpcUrlAELF,
    });
    const { callSendMethod: callTDVVSendMethod, callViewMethod: callTDVVViewMethod } = useCallContract({
      chainId: SupportedELFChainId.TDVV_NET,
      rpcUrl: cmsInfo?.rpcUrlTDVV,
    });
    const { callSendMethod: callTDVWSendMethod, callViewMethod: callTDVWViewMethod } = useCallContract({
      chainId: SupportedELFChainId.TDVW_NET,
      rpcUrl: cmsInfo?.rpcUrlTDVW,
    });

    useWalletInit();
    useBroadcastChannel();

    useEffect(() => {
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

    useEffect(() => {
      console.log('webLoginContext.loginState', webLoginContext.loginState);
      WebLoginInstance.get().setContractMethod([
        {
          chain: SupportedELFChainId.MAIN_NET,
          sendMethod: callAELFSendMethod,
          viewMethod: callAELFViewMethod,
        },
        {
          chain: SupportedELFChainId.TDVV_NET,
          sendMethod: callTDVVSendMethod,
          viewMethod: callTDVVViewMethod,
        },
        {
          chain: SupportedELFChainId.TDVW_NET,
          sendMethod: callTDVWSendMethod,
          viewMethod: callTDVWViewMethod,
        },
      ]);
    }, [webLoginContext.loginState]);

    return (
      <SafeArea>
        <AntdLayout className="bg-[#FAFAFA] h-full overflow-scroll">
          <Header />
          <AntdLayout.Content
            className={`schrodinger-content flex-shrink-0 flex justify-center bg-[#FAFAFA] max-w-[1440px] px-[16px] md:px-[40px] mx-auto w-full`}>
            {children}
          </AntdLayout.Content>
          <Footer />
        </AntdLayout>
      </SafeArea>
    );
  };
});

export default Layout;
