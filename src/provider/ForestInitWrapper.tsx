/* eslint-disable import/no-anonymous-default-export */
import { Trade, Collection, ForestProvider, useForestStore, Store } from 'forest-ui-react';
import 'forest-ui-react/dist/assets/index.css';
import { useCallback, useEffect, useState } from 'react';
import { fetchForestConfigItems } from 'api/request';
import { cloneDeep } from 'lodash-es';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';

export default ({ children }: { children: React.ReactNode }) => {
  const [state, { dispatch }] = useForestStore();
  const [loading, setLoading] = useState(false);
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
        type: 'setAelfInfo',
        payload: {
          aelfInfo: data,
        },
      });

      dispatch({
        type: 'setCurChain',
        payload: {
          chain: data.curChain,
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
