'use client';
import React, { useEffect, Suspense, useState } from 'react';
import { Layout as AntdLayout } from 'antd';
import Header from 'components/Header';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';
import { setIsMobile } from 'redux/reducer/info';
import isMobile from 'utils/isMobile';
import Footer from 'components/Footer';
import { useBroadcastChannel, useWalletInit } from 'hooks/useWallet';
import NotFoundPage from 'pageComponents/notFound/index';

const Layout = dynamic(async () => {
  const { WebLoginState, useWebLogin, useCallContract, WebLoginEvents, useWebLoginEvent } =
    await import('aelf-web-login').then((module) => module);
  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;

    const [isCorrectUrl, setIsCorrectUrl] = useState(true);

    useWalletInit();
    useBroadcastChannel();

    useEffect(() => {
      const resize = () => {
        const ua = navigator.userAgent;
        const mobileType = isMobile(ua);
        const isMobileDevice =
          mobileType.apple.phone ||
          mobileType.android.phone ||
          mobileType.apple.tablet ||
          mobileType.android.tablet;
        store.dispatch(setIsMobile(isMobileDevice));
      };
      resize();
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }, []);

    return (
      <>
        {isCorrectUrl ? (
          <AntdLayout className="bg-[#FAFAFA] h-full overflow-scroll">
            <Header />
            <AntdLayout.Content
              className={`schrodinger-content flex-shrink-0 flex justify-center bg-[#FAFAFA] max-w-[1440px] px-[16px] md:px-[40px] mx-auto w-full`}
            >
              {children}
            </AntdLayout.Content>
            <Footer />
          </AntdLayout>
        ) : (
          <NotFoundPage />
        )}
      </>
    );
  };
});

export default Layout;
