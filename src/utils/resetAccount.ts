import { ETRANSFER_TOKEN_KEY } from 'constants/assets';
import { setItemsFromLocal } from 'redux/reducer/info';
import { resetLoginStatus } from 'redux/reducer/loginStatus';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { dispatch } from 'redux/store';
import { storages } from 'constants/storages';
import { unsubscribeUserOrderRecord } from '@etransfer/ui-react';

export const resetAccount = () => {
  const walletInfo = localStorage.getItem(storages.walletInfo);
  const address = walletInfo ? JSON.parse(walletInfo).address : '';
  address && unsubscribeUserOrderRecord(address);
  localStorage.removeItem(storages.accountInfo);
  localStorage.removeItem(storages.walletInfo);
  localStorage.removeItem(ETRANSFER_TOKEN_KEY);
  dispatch(
    setWalletInfo({
      address: '',
      aelfChainAddress: '',
    }),
  );
  dispatch(setItemsFromLocal([]));
  dispatch(resetLoginStatus());
};
