import { useCallback, useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { setLoginStatus } from 'redux/reducer/loginStatus';
import { dispatch } from 'redux/store';
import { storages } from 'constants/storages';
import { useGetToken } from './useGetToken';
import { resetAccount } from 'utils/resetAccount';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { sleep } from '@portkey/utils';
import { useRouter } from 'next/navigation';
import useTelegram from './useTelegram';

const useUpdateLoginStatus = () => {
  const { isConnected, walletInfo, loginOnChainStatus, disConnectWallet } = useConnectWallet();
  const { hasToken } = useGetLoginStatus();
  const { checkTokenValid } = useGetToken();
  const router = useRouter();
  const { isInTG } = useTelegram();

  const onLoginFail = useCallback(async () => {
    if (isInTG) {
      return;
    }
    await sleep(2000);
    router.push('/');
    disConnectWallet();
  }, [disConnectWallet, isInTG, router]);

  useEffect(() => {
    console.log('=====checkLoginOnChainStatus loginOnChainStatus', loginOnChainStatus);

    if (loginOnChainStatus === LoginStatusEnum.FAIL) {
      onLoginFail();
    }
  }, [loginOnChainStatus, onLoginFail]);

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
