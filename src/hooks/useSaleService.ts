import { useCmsInfo } from 'redux/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import getMaxNftQuantityOfSell from 'utils/getMaxNftQuantityOfSell';
import { fetchNftSalesInfo } from 'api/request';
import useLoading from './useLoading';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export function useGetListItemsForSale({ symbol, decimals }: { symbol: string; decimals: number }) {
  const { walletInfo } = useConnectWallet();
  const { curChain } = useCmsInfo() || {};
  const [listedAmount, setListedAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const getMaxNftQuantity = useCallback(async () => {
    if (symbol && walletInfo?.address) {
      const res = await getMaxNftQuantityOfSell(curChain!, symbol, decimals, walletInfo.address);
      if (!res) {
        return;
      }

      console.log('getMaxNftQuantityOfSell', res);

      setListedAmount(res.listedAmount);
      setBalance(res.balance);
    }
  }, [curChain, decimals, symbol, walletInfo?.address]);

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
  const { walletInfo } = useConnectWallet();
  const { showLoading, closeLoading } = useLoading();

  const nftId = useMemo(() => {
    return symbol && curChain ? `${curChain}-${symbol}` : '';
  }, [curChain, symbol]);

  const fetchSaleInfo = useCallback(async () => {
    if (!nftId || !walletInfo?.address) return;
    try {
      showLoading();
      const saleInfo = await fetchNftSalesInfo({
        id: nftId,
        excludedAddress: walletInfo.address,
      });
      closeLoading();
      if (saleInfo) setSaleInfo(saleInfo);
    } catch (error) {
      console.error(error);
    } finally {
      closeLoading();
    }
  }, [closeLoading, nftId, showLoading, walletInfo?.address]);

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
