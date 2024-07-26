import { Trade, Collection, ForestProvider, useForestStore, Store } from 'forest-ui-react';
import 'forest-ui-react/dist/assets/index.css';
import { useSelector } from 'react-redux';

import Wrapper from './wrapper';
import { store } from 'redux/store';
import { cloneDeep } from 'lodash-es';

export default () => {
  const { walletInfo } = cloneDeep(useSelector((store: any) => store.userInfo));
  Store.getInstance().setStore('walletInfo', walletInfo);
  Store.getInstance().setStore('env', process.env.NEXT_PUBLIC_APP_ENV);

  console.log(Store.getInstance());

  return (
    <ForestProvider>
      <Wrapper>
        <Trade />
      </Wrapper>
    </ForestProvider>
  );
};
