import { LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { did } from '@portkey/did-ui-react';
import { message } from 'antd';
import { loginOnChainStatusFailMessage } from './formatError';

export const checkLoginOnChainStatus = () => {
  console.log('=====checkLoginOnChainStatus', did.didWallet.isLoginStatus);
  const loginOnChainStatus = did.didWallet.isLoginStatus;
  if (loginOnChainStatus === LoginStatusEnum.FAIL) {
    message.error(loginOnChainStatusFailMessage.errorMessage.message, 2);
    return false;
  }
  return true;
};
