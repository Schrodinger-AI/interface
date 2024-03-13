'use client';
import StoreProvider from './store';
import { AELFDProvider } from 'aelf-design';
import WebLoginProvider from './webLoginProvider';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { store } from 'redux/store';

import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

import { checkDomain, fetchCmsConfigInfo } from 'api/request';
import NiceModal from '@ebay/nice-modal-react';
import { setCmsInfo } from 'redux/reducer/info';
import NotFoundPage from 'components/notFound';
import { AELFDProviderTheme } from './config';
import BigNumber from 'bignumber.js';
import { useEffectOnce } from 'react-use';
import { NotFoundType } from 'constants/index';
import Loading from 'components/PageLoading/index';
import { Updater } from 'components/Updater';
import { usePathname, useRouter } from 'next/navigation';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isCorrectDomain, setIsCorrectDomain] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkHost = async () => {
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
  };

  const isCorrectPath = useMemo(() => {
    return ['/', '/assets', '/points'].includes(pathname);
  }, [pathname]);

  const redirect = useCallback(
    (openTimeStamp: string) => {
      if (!isCorrectPath) {
        const currentTime = new Date().getTime();
        if (BigNumber(openTimeStamp || 0).gt(currentTime)) {
          // TODO
          // router.replace('/coundown');
        } else {
          // TODO
          // router.replace('/tokens');
        }
      }
    },
    [isCorrectPath, router],
  );
  const fetchGlobalConfig = async () => {
    try {
      const res = await fetchCmsConfigInfo();
      store.dispatch(setCmsInfo(res));
      redirect(res.openTimeStamp);
    } catch (err) {
      console.error('fetchGlobalConfig err', err);
    }
    setLoading(false);
  };

  const initPageData = async () => {
    const hostCorrect = await checkHost();
    if (hostCorrect) {
      await fetchGlobalConfig();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    initPageData();
  }, []);

  useEffectOnce(() => {
    BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
  });

  return (
    <>
      <StoreProvider>
        <AELFDProvider theme={AELFDProviderTheme}>
          <ConfigProvider locale={enUS} autoInsertSpaceInButton={false}>
            {loading ? (
              <Loading content="Enrollment in progress"></Loading>
            ) : isCorrectDomain ? (
              <WebLoginProvider>
                <Updater>
                  <NiceModal.Provider>{children}</NiceModal.Provider>
                </Updater>
              </WebLoginProvider>
            ) : (
              <NotFoundPage type={isCorrectDomain ? NotFoundType.path : NotFoundType.domain} />
            )}
          </ConfigProvider>
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
