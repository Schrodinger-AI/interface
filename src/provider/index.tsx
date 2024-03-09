'use client';
import StoreProvider from './store';
import { AELFDProvider } from 'aelf-design';
import WebLoginProvider from './webLoginProvider';

import { useEffect, useState } from 'react';
import { store } from 'redux/store';
import Loading from 'components/Loading';

import { checkDomain, fetchCmsConfigInfo } from 'api/request';
import NiceModal from '@ebay/nice-modal-react';
import { setCmsInfo } from 'redux/reducer/info';
import NotFoundPage from 'components/notFound';
import { AELFDProviderTheme } from './config';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isCorrectUrl, setIsCorrectUrl] = useState(false);

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

  return (
    <>
      <StoreProvider>
        <AELFDProvider theme={AELFDProviderTheme}>
          {loading ? (
            <Loading content="Enrollment in progress"></Loading>
          ) : isCorrectUrl ? (
            <WebLoginProvider>
              <NiceModal.Provider>{children}</NiceModal.Provider>
            </WebLoginProvider>
          ) : (
            <NotFoundPage />
          )}
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
