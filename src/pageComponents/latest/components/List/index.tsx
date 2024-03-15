import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { TSGRItem } from 'types/tokens';
import ScrollContent from 'components/ScrollContent';
import useLoading from 'hooks/useLoading';
import { divDecimals, getPageNumber } from 'utils/calculate';
import { TGetSchrodingerListParams, useGetSchrodingerList } from 'graphqlServer';
import { useCmsInfo } from 'redux/hooks';
import { CardType } from 'components/ItemCard';
import { useLatestColumns, useLatestGutter } from './hooks/useLayout';
import Header from '../Header';
import LearnMoreModal from 'components/LearnMoreModal';
import { useModal } from '@ebay/nice-modal-react';

const pageSize = 32;
export default function List() {
  const [total, setTotal] = useState(0);
  const [current, SetCurrent] = useState(1);
  const [dataSource, setDataSource] = useState<TSGRItem[]>([]);
  const isLoadMore = useRef<boolean>(false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { showLoading, closeLoading, visible: isLoading } = useLoading();
  const cmsInfo = useCmsInfo();
  const gutter = useLatestGutter();
  const column = useLatestColumns();
  const learnMoreModal = useModal(LearnMoreModal);

  const hasMore = useMemo(() => {
    return total > dataSource.length;
  }, [total, dataSource]);

  const getSchrodingerList = useGetSchrodingerList();

  const fetchData = useCallback(
    async ({ params, loadMore = false }: { params: TGetSchrodingerListParams['input']; loadMore?: boolean }) => {
      if (!params.chainId) {
        return;
      }
      if (loadMore) {
        setMoreLoading(true);
      } else {
        isLoadMore.current = false;
        showLoading();
      }
      try {
        const {
          data: { getSchrodingerList: res },
        } = await getSchrodingerList({
          input: params,
        });
        setTotal(res.totalCount ?? 0);
        const data = (res.data || []).map((item) => {
          return {
            ...item,
            amount: divDecimals(item.amount, item.decimals).toFixed(),
          };
        });
        if (isLoadMore.current) {
          setDataSource((preData) => [...preData, ...data]);
          setLoadingMore(true);
        } else {
          setDataSource(data);
          setLoadingMore(false);
        }
      } finally {
        closeLoading();
        setMoreLoading(false);
      }
    },
    // There cannot be dependencies showLoading and closeLoading
    [getSchrodingerList],
  );

  const requestParams = useMemo(() => {
    return {
      chainId: cmsInfo?.curChain ?? 'tDVV',
      skipCount: getPageNumber(current, pageSize),
      maxResultCount: pageSize,
    };
  }, [cmsInfo?.curChain, current]);

  const loadMoreData = useCallback(() => {
    setLoadingMore(true);
    if (isLoading || !hasMore || moreLoading) return;
    isLoadMore.current = true;
    SetCurrent(current + 1);
    fetchData({
      params: {
        ...requestParams,
        skipCount: getPageNumber(current + 1, pageSize),
      },
      loadMore: true,
    });
  }, [isLoading, hasMore, moreLoading, current, fetchData, requestParams]);

  const defaultRequestParams = useMemo(() => {
    return {
      chainId: cmsInfo?.curChain ?? 'tDVV',
      skipCount: 0,
      maxResultCount: pageSize,
    };
  }, [cmsInfo?.curChain]);

  const initData = useCallback(() => {
    setDataSource([]);
    fetchData({
      params: defaultRequestParams,
    });
  }, [defaultRequestParams, fetchData]);

  const goForest = useCallback(
    (item: TSGRItem) => {
      learnMoreModal.show({
        item,
      });
    },
    [learnMoreModal],
  );

  useEffect(() => initData(), [fetchData, defaultRequestParams, initData]);

  return (
    <>
      <Header onClick={initData} />
      <ScrollContent
        grid={{ gutter, column }}
        type={CardType.LATEST}
        onPress={goForest}
        ListProps={{
          dataSource,
        }}
        InfiniteScrollProps={{
          total,
          hasMore,
          loadingMore,
          loading: moreLoading,
          loadMore: loadMoreData,
        }}
      />
    </>
  );
}
