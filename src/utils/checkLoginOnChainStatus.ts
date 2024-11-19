import { LoginStatusEnum, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { did } from '@portkey/did-ui-react';
import NiceModal from '@ebay/nice-modal-react';
import SyncingOnChainLoading from 'components/SyncingOnChainLoading';
import { storages } from 'constants/storages';

export const checkLoginOnChainStatus = () => {
  console.log('=====checkLoginOnChainStatus', did.didWallet.isLoginStatus);
  const loginOnChainStatus = did.didWallet.isLoginStatus;
  const walletType = localStorage.getItem(storages.currentLoginWalletType);

  if (walletType === WalletTypeEnum.aa && loginOnChainStatus === LoginStatusEnum.INIT) {
    // message.error(loginOnChainStatusFailMessage.errorMessage.message, 2);
    NiceModal.show(SyncingOnChainLoading, {
      checkLoginOnChainStatus: true,
    });
    return false;
  }
  return true;
};
