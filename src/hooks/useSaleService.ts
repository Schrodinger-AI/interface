import { useCmsInfo } from 'redux/hooks';
import { useWalletService } from './useWallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import getMaxNftQuantityOfSell from 'utils/getMaxNftQuantityOfSell';
import { fetchNftSalesInfo } from 'api/request';
import useLoading from './useLoading';

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
    fetchData: getMaxNftQuantity,
  };
}

export function useSaleInfo({ symbol }: { symbol: string }) {
  const { curChain } = useCmsInfo() || {};
  const [saleInfo, setSaleInfo] = useState<INftSaleInfoItem>();
  const { wallet } = useWalletService();
  const { showLoading, closeLoading } = useLoading();

  const nftId = useMemo(() => {
    return symbol && curChain ? `${curChain}-${symbol}` : '';
  }, [curChain, symbol]);

  const fetchSaleInfo = useCallback(async () => {
    if (!nftId || !wallet.address) return;
    try {
      showLoading();
      const saleInfo = await fetchNftSalesInfo({
        id: nftId,
        excludedAddress: wallet.address,
      });
      closeLoading();
      if (saleInfo) setSaleInfo(saleInfo);
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  }, [closeLoading, nftId, showLoading, wallet.address]);

  const maxBuyAmount = useMemo(() => {
    return saleInfo?.availableQuantity || 0;
  }, [saleInfo?.availableQuantity]);

  useEffect(() => {
    fetchSaleInfo();
  }, [fetchSaleInfo]);

  return {
    maxBuyAmount,
    saleInfo,
    fetchData: fetchSaleInfo,
  };
}
