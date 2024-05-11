import { useWalletService } from './useWallet';
import { useEffect } from 'react';
import { getMessageUnreadCount } from 'utils/getMessageUnreadCount';

const useGetUnreadMessagesCount = () => {
  const { wallet } = useWalletService();

  useEffect(() => {
    if (wallet.address) {
      getMessageUnreadCount(wallet.address);
    }
  }, [wallet.address]);
};

export default useGetUnreadMessagesCount;
