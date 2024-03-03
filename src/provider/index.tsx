'use client';
import StoreProvider from './store';
import { ConfigProvider } from 'antd';
import { AELFDProvider } from 'aelf-design';
import enUS from 'antd/lib/locale/en_US';
import WebLoginProvider from './webLoginProvider';

import { useEffect, useState } from 'react';
import { store } from 'redux/store';
import Loading from 'components/Loading';
import { setEthData } from 'redux/reducer/data';

import { fetchCmsConfigInfo, fetchEtherscan } from 'api/request';
import NiceModal from '@ebay/nice-modal-react';
import { setCmsInfo } from 'redux/reducer/info';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const fetchGlobalConfig = async () => {
    try {
      // const { result } = await fetchCmsConfigInfo();
      // store.dispatch(setCmsInfo(result));
      setLoading(false);
    } catch (err) {
      console.error('fetchGlobalConfig err', err);
    }
  };
  useEffect(() => {
    fetchGlobalConfig();
  }, []);

  return (
    <>
      <StoreProvider>
        <AELFDProvider>
          <ConfigProvider locale={enUS} autoInsertSpaceInButton={false}>
            {loading ? (
              <Loading content="Enrollment in progress"></Loading>
            ) : (
              <WebLoginProvider>
                <NiceModal.Provider>{children}</NiceModal.Provider>
              </WebLoginProvider>
            )}
          </ConfigProvider>
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
