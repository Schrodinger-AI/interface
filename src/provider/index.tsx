'use client';
import '@rainbow-me/rainbowkit/styles.css';
import StoreProvider from './store';
import { AELFDProvider } from 'aelf-design';
import WebLoginProvider from './webLoginProvider';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { store } from 'redux/store';

import { ConfigProvider, message } from 'antd';
import enUS from 'antd/lib/locale/en_US';

import { checkDomain } from 'api/request';
import NiceModal from '@ebay/nice-modal-react';
import { setCmsInfo } from 'redux/reducer/info';
import NotFoundPage from 'components/notFound';
import { AELFDProviderTheme } from './config';
import BigNumber from 'bignumber.js';
import { useEffectOnce } from 'react-use';
import { NotFoundType } from 'constants/index';
import Loading from 'components/PageLoading/index';
import { usePathname } from 'next/navigation';
import { forbidScale } from 'utils/common';
import dynamic from 'next/dynamic';
import { useRequestCms } from 'redux/hooks';
import { metaMaskWallet, okxWallet, phantomWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { APP_NAME, PROJECT_ID, APP_NAME_TEST, PROJECT_ID_TEST } from 'constants/connectEvmWalletConfig';
import { ENVIRONMENT } from 'constants/url';

const Updater = dynamic(() => import('components/Updater'), { ssr: false });

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isCorrectDomain, setIsCorrectDomain] = useState(false);
  const pathname = usePathname();
  const { getCmsInfo } = useRequestCms();

  const checkHost = useCallback(async () => {
    try {
      const res = await checkDomain();
      if (res && res === 'Success') {
        setIsCorrectDomain(true);
        return true;
      } else {
        setIsCorrectDomain(false);
        return false;
      }
    } catch (err) {
      console.error('checkHost err', err);
      return false;
    }
  }, []);

  const fetchGlobalConfig = useCallback(async () => {
    const res = await getCmsInfo();
    store.dispatch(setCmsInfo(res));
    setLoading(false);
  }, [getCmsInfo]);

  const isNoNeedLoadingPage = useMemo(() => {
    return ['/privacy-policy'].includes(pathname);
  }, [pathname]);

  const initPageData = useCallback(async () => {
    if (isNoNeedLoadingPage) {
      setIsCorrectDomain(true);
      setLoading(false);
      return;
    }
    const hostCorrect = await checkHost();
    if (hostCorrect) {
      await fetchGlobalConfig();
    } else {
      setLoading(false);
    }
  }, [checkHost, fetchGlobalConfig, isNoNeedLoadingPage]);

  useEffect(() => {
    initPageData();
    forbidScale();
  }, [initPageData]);

  useEffectOnce(() => {
    BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
    message.config({
      maxCount: 1,
    });
  });

  const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [walletConnectWallet, metaMaskWallet, okxWallet, phantomWallet],
      },
    ],
    {
      appName: env === ENVIRONMENT.TEST ? APP_NAME_TEST : APP_NAME,
      projectId: env === ENVIRONMENT.TEST ? PROJECT_ID_TEST : PROJECT_ID,
    },
  );

  const wagmiConfig = createConfig({
    chains: [mainnet, polygon, optimism, arbitrum, base, zora],
    connectors,
  } as any);

  const queryClient = new QueryClient();

  return (
    <>
      <StoreProvider>
        <AELFDProvider theme={AELFDProviderTheme}>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider locale="en-US">
                <ConfigProvider locale={enUS} autoInsertSpaceInButton={false}>
                  {loading ? (
                    <Loading content="Enrollment in progress"></Loading>
                  ) : isCorrectDomain ? (
                    <WebLoginProvider>
                      <Updater />
                      <NiceModal.Provider>{children}</NiceModal.Provider>
                    </WebLoginProvider>
                  ) : (
                    <NotFoundPage type={isCorrectDomain ? NotFoundType.path : NotFoundType.domain} />
                  )}
                </ConfigProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
