import { ETRANSFER_TOKEN_KEY } from 'constants/assets';
import { setItemsFromLocal } from 'redux/reducer/info';
import { resetLoginStatus } from 'redux/reducer/loginStatus';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { dispatch } from 'redux/store';
import { storages } from 'constants/storages';

export const resetAccount = () => {
  localStorage.removeItem(storages.accountInfo);
  localStorage.removeItem(storages?.walletInfo);
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
