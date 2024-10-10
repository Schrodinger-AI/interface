import { useCallback, useEffect } from 'react';
import { did } from '@portkey/did-ui-react';
import { LoginStatusEnum } from '@portkey/types';
import { appName } from 'constants/common';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export const useOnFinish = () => {
  const { walletInfo } = useConnectWallet();
  console.log('=====useOnFinish', walletInfo);
  const checkLoginStatus = useCallback(async () => {
    if (did.didWallet.isLoginStatus === LoginStatusEnum.INIT) {
      await did.didWallet.getLoginStatus({
        sessionId: did.didWallet.sessionId!,
        chainId: did.didWallet.originChainId!,
      });
      const pin = walletInfo?.extraInfo?.portkeyInfo?.pin;
      did.save(pin, appName);
    }
  }, [walletInfo?.extraInfo?.portkeyInfo?.pin]);
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);
};
