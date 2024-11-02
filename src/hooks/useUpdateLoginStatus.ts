import { useCallback, useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { setLoginStatus } from 'redux/reducer/loginStatus';
import { dispatch } from 'redux/store';
import { storages } from 'constants/storages';
import { useGetToken } from './useGetToken';
import { resetAccount } from 'utils/resetAccount';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { message } from 'antd';
import { sleep } from '@portkey/utils';
import { useRouter } from 'next/navigation';
import useTelegram from './useTelegram';

const useUpdateLoginStatus = () => {
  const { isConnected, walletInfo, loginOnChainStatus, disConnectWallet } = useConnectWallet();
  const { hasToken } = useGetLoginStatus();
  const { checkTokenValid } = useGetToken();
  const router = useRouter();
  const { isInTG } = useTelegram();

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

  const onLoginFail = useCallback(async () => {
    message.error('Syncing failed, please log in again.', 2);
    if (isInTG) {
      return;
    }
    await sleep(2000);
    router.push('/');
    disConnectWallet();
  }, [disConnectWallet, isInTG, router]);

  useEffect(() => {
    if (loginOnChainStatus === LoginStatusEnum.FAIL) {
      onLoginFail();
    }
  }, [loginOnChainStatus, onLoginFail]);
};

export default useUpdateLoginStatus;
