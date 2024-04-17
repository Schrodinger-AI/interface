import { WebLoginState, useWebLogin } from 'aelf-web-login';
import { useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { setLoginStatus } from 'redux/reducer/loginStatus';
import { dispatch } from 'redux/store';
import { storages } from 'storages';

const useUpdateLoginStatus = () => {
  const { loginState } = useWebLogin();
  const { hasToken } = useGetLoginStatus();

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    const hasLocalToken = !!accountInfo.token;
    const isConnectWallet = loginState === WebLoginState.logined;
    dispatch(
      setLoginStatus({
        walletStatus: loginState,
        isConnectWallet,
        hasToken: hasLocalToken,
        isLogin: isConnectWallet && hasLocalToken,
      }),
    );
  }, [loginState, hasToken]);
};

export default useUpdateLoginStatus;
