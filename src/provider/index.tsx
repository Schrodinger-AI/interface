'use client';
import StoreProvider from './store';
import { ConfigProvider } from 'antd';
import { AELFDProvider } from 'aelf-design';
import enUS from 'antd/lib/locale/en_US';
import WebLoginProvider from './webLoginProvider';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { store } from 'redux/store';
import Loading from 'components/Loading';
import { setEthData } from 'redux/reducer/data';

import { checkDomain, fetchCmsConfigInfo, fetchEtherscan } from 'api/request';
import NiceModal from '@ebay/nice-modal-react';
import { setCmsInfo } from 'redux/reducer/info';
import { usePathname } from 'next/navigation';
import NotFoundPage from 'components/notFound';
import { NotFoundType } from 'constants/index';
import { forbidScale } from 'utils/common';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isCorrectDomain, setIsCorrectDomain] = useState(false);
  const pathname = usePathname();

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
    try {
      const res = await fetchCmsConfigInfo();
      store.dispatch(setCmsInfo(res));
    } catch (err) {
      console.error('fetchGlobalConfig err', err);
    }
    setLoading(false);
  }, []);

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
  }, [isNoNeedLoadingPage]);

  useEffect(() => {
    initPageData();
    forbidScale();
  }, [initPageData]);

  const isCorrectPath = useMemo(() => {
    return ['/', '/assets', '/points', '/privacy-policy'].includes(pathname);
  }, [pathname]);

  const showPage = useMemo(() => {
    return isCorrectDomain && isCorrectPath;
  }, [isCorrectDomain, isCorrectPath]);

  return (
    <>
      <StoreProvider>
        <AELFDProvider>
          <ConfigProvider locale={enUS} autoInsertSpaceInButton={false}>
            {loading ? (
              <Loading content="Enrollment in progress"></Loading>
            ) : showPage ? (
              <WebLoginProvider>
                <NiceModal.Provider>{children}</NiceModal.Provider>
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
