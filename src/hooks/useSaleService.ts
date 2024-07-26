import { useCmsInfo } from 'redux/hooks';
import { useWalletService } from './useWallet';
import { useCallback, useEffect, useState } from 'react';
import getMaxNftQuantityOfSell from 'utils/getMaxNftQuantityOfSell';

export function useGetListItemsForSale({ symbol, decimals }: { symbol: string; decimals: number }) {
  const { wallet } = useWalletService();
  const { curChain } = useCmsInfo() || {};
  const [listedAmount, setListedAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const getMaxNftQuantity = useCallback(async () => {
    if (symbol && wallet.address) {
      const res = await getMaxNftQuantityOfSell(curChain!, symbol, decimals, wallet.address);
      if (!res) {
        return;
      }

      console.log('getMaxNftQuantityOfSell', res);

      setListedAmount(res.listedAmount);
      setBalance(res.balance);
    }
  }, [curChain, decimals, symbol, wallet.address]);

  useEffect(() => {
    getMaxNftQuantity();
  }, [getMaxNftQuantity]);

  return {
    listedAmount,
    balance,
  };
}
