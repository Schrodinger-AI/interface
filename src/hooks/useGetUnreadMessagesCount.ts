import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useEffect } from 'react';
import { getMessageUnreadCount } from 'utils/getMessageUnreadCount';

const useGetUnreadMessagesCount = () => {
  const { walletInfo } = useConnectWallet();

  useEffect(() => {
    if (walletInfo?.address) {
      getMessageUnreadCount(walletInfo.address);
    }
  }, [walletInfo?.address]);
};

export default useGetUnreadMessagesCount;
