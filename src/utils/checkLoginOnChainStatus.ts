import { LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { did } from '@portkey/did-ui-react';

export const checkLoginOnChainStatus = async () => {
  console.log('=====checkLoginOnChainStatus', did.didWallet.isLoginStatus);
  const loginOnChainStatus = did.didWallet.isLoginStatus;
  if (loginOnChainStatus !== LoginStatusEnum.SUCCESS) {
    return false;
  }
  return true;
};
