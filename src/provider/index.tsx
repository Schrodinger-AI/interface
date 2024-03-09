'use client';
import StoreProvider from './store';
import { ConfigProvider } from 'antd';
import { AELFDProvider } from 'aelf-design';
import enUS from 'antd/lib/locale/en_US';
import WebLoginProvider from './webLoginProvider';

import { useEffect, useMemo, useState } from 'react';
import { store } from 'redux/store';
import Loading from 'components/Loading';
import { setEthData } from 'redux/reducer/data';

import { checkDomain, fetchCmsConfigInfo, fetchEtherscan } from 'api/request';
import NiceModal from '@ebay/nice-modal-react';
import { setCmsInfo } from 'redux/reducer/info';
import { usePathname } from 'next/navigation';
import NotFoundPage from 'components/notFound';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isCorrectUrl, setIsCorrectUrl] = useState(false);
  const pathname = usePathname();

  const checkHost = async () => {
    try {
      const res = await checkDomain();
      if (res && res === 'Success') {
        setIsCorrectUrl(true);
        return true;
      } else {
        setIsCorrectUrl(false);
        return false;
      }
    } catch (err) {
      console.error('checkHost err', err);
      return false;
    }
  };

  const fetchGlobalConfig = async () => {
    try {
      const res = await fetchCmsConfigInfo();
      store.dispatch(setCmsInfo(res));
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

  const isCorrectPath = useMemo(() => {
    return ['/', '/assets', '/points'].includes(pathname);
  }, [pathname]);

  const showPage = useMemo(() => {
    return isCorrectUrl && isCorrectPath;
  }, [isCorrectPath, isCorrectUrl]);

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
              <NotFoundPage />
            )}
          </ConfigProvider>
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
