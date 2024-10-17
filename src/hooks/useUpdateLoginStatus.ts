import { useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { setLoginStatus } from 'redux/reducer/loginStatus';
import { dispatch } from 'redux/store';
import { storages } from 'constants/storages';
import { useGetToken } from './useGetToken';
import { resetAccount } from 'utils/resetAccount';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

const useUpdateLoginStatus = () => {
  const { isConnected, walletInfo } = useConnectWallet();
  const { hasToken } = useGetLoginStatus();
  const { checkTokenValid } = useGetToken();

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    let hasLocalToken = !!accountInfo.token && checkTokenValid();
    if (!isConnected) {
      resetAccount();
      hasLocalToken = false;
      return;
    }
    dispatch(
      setLoginStatus({
        isConnectWallet: isConnected,
        hasToken: hasLocalToken,
        isLogin: isConnected && walletInfo?.address && hasLocalToken,
      }),
    );
  }, [hasToken, checkTokenValid, isConnected, walletInfo]);
};

export default useUpdateLoginStatus;
