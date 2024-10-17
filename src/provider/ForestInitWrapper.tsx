/* eslint-disable import/no-anonymous-default-export */
import { useForestStore, Store } from 'forest-ui-react';
import 'forest-ui-react/dist/assets/index.css';
import { useCallback, useEffect, useState } from 'react';
import { fetchForestConfigItems } from 'api/request';
import { cloneDeep } from 'lodash-es';
import { useCmsInfo } from 'redux/hooks';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export default ({ children }: { children: React.ReactNode }) => {
  const [state, { dispatch }] = useForestStore();
  const [loading, setLoading] = useState(false);
  const cmsInfo = useCmsInfo();
  const { walletInfo } = cloneDeep(useConnectWallet());

  useEffect(() => {
    if (!walletInfo) return;
    // Store.getInstance().setStore('walletInfo', walletInfo);
    // TODO: After upgrading forest sdk, you can delete the current
    Store.getInstance().setStore('walletInfo', {
      ...walletInfo,
      ...walletInfo.extraInfo,
    });
    Store.getInstance().setStore('env', process.env.NEXT_PUBLIC_APP_ENV);
    console.log(Store.getInstance());
  }, [walletInfo]);

  const fetchForestConfig = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchForestConfigItems();
      dispatch({
        type: 'setCurChain',
        payload: {
          chain: cmsInfo?.curChain,
        },
      });

      dispatch({
        type: 'setAelfInfo',
        payload: {
          aelfInfo: data,
        },
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [cmsInfo?.curChain, dispatch]);

  useEffect(() => {
    fetchForestConfig();
  }, [fetchForestConfig]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};
