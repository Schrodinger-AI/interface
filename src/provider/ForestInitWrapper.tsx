/* eslint-disable import/no-anonymous-default-export */
import { useForestStore, Store } from 'forest-ui-react';
import 'forest-ui-react/dist/assets/index.css';
import { useCallback, useEffect, useState } from 'react';
import { fetchForestConfigItems } from 'api/request';
import { cloneDeep } from 'lodash-es';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { useCmsInfo } from 'redux/hooks';

export default ({ children }: { children: React.ReactNode }) => {
  const [state, { dispatch }] = useForestStore();
  const [loading, setLoading] = useState(false);
  const cmsInfo = useCmsInfo();
  const { walletInfo } = cloneDeep(useSelector((store: AppState) => store.userInfo));

  useEffect(() => {
    Store.getInstance().setStore('walletInfo', walletInfo);
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
  }, [dispatch]);

  useEffect(() => {
    fetchForestConfig();
  }, [fetchForestConfig]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};
