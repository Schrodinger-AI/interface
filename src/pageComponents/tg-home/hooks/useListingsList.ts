import { fetchListings, getTokenUsdPrice } from 'api/request';
import { useCallback, useEffect, useState } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { FormatListingType } from 'types';
import getExpiryTime from 'utils/getExpiryTime';

interface IProps {
  page?: number;
  pageSize?: number;
  symbol: string;
  excludedAddress?: string;
  address?: string;
  chainId: Chain;
}

const getListings = async ({ page = 1, pageSize = 10, symbol, address, excludedAddress, chainId }: IProps) => {
  try {
    const result = await fetchListings({
      chainId,
      symbol,
      skipCount: (page - 1) * pageSize,
      maxResultCount: pageSize,
      excludedAddress,
      address,
    });

    if (!result) {
      return false;
    }

    const resultItem = result?.items;
    const resultTotalCount = result?.totalCount;
    const showList = resultItem.map((item: IListingType): FormatListingType => {
      const price = item.whitelistPrices !== null ? item.whitelistPrices : item.prices;
      return {
        key: item.publicTime.toString(),
        purchaseToken: { symbol: item.purchaseToken.symbol.toLocaleUpperCase() },
        decimals: item.decimals ?? 8,
        price,
        quantity: item.quantity,
        ownerAddress: item?.ownerAddress || '',
        expiration: getExpiryTime(item.endTime),
        fromName: item?.owner?.name || '--',
        whitelistHash: item.whitelistId,
        startTime: item.startTime,
        originQuantity: item.originQuantity,
        endTime: item.endTime,
      };
    });

    return {
      list: showList || [],
      totalCount: resultTotalCount ?? 0,
    };
  } catch (error) {
    return false;
  }
};

export default function useListingsList({ symbol }: { symbol: string }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [listings, setListings] = useState<Array<FormatListingType>>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { curChain } = useCmsInfo() || {};
  const [loading, setLoading] = useState<boolean>(false);
  const [elfPrice, setElfPrice] = useState('0');

  const fetchData = useCallback(
    async (params?: { address?: string }) => {
      const { address } = params || {};
      if (!symbol) return;
      setLoading(true);
      const res = await getListings({
        page,
        symbol,
        chainId: curChain!,
        address: address,
      });
      setLoading(false);
      if (res) {
        const { totalCount, list } = res;
        setListings(list || []);
        setTotalCount(totalCount || 0);
      }
    },
    [curChain, page, symbol],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onChange = useCallback((page?: number, pageSize?: number) => {
    page && setPage(page);
  }, []);

  const getElfPrice = useCallback(async () => {
    try {
      const { price } = await getTokenUsdPrice({
        symbol: 'ELF',
      });
      price && setElfPrice(String(price));
    } catch (error) {
      console.error(error);
      setElfPrice('0');
    }
  }, []);

  useEffect(() => {
    getElfPrice();
  }, [getElfPrice]);

  return {
    listings,
    totalCount,
    page,
    pageSize,
    onChange,
    elfPrice,
    fetchData,
    loading,
  };
}
