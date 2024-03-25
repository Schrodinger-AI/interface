import { useState, useMemo, useCallback, useEffect } from 'react';
import { TSGRItem } from 'types/tokens';
import ScrollContent from 'components/ScrollContent';
import useLoading from 'hooks/useLoading';
import { divDecimals, getPageNumber, timesDecimals } from 'utils/calculate';

import { useCmsInfo } from 'redux/hooks';
import { CardType } from 'components/ItemCard';
import { useLatestColumns, useLatestGutter } from './hooks/useLayout';
import Header from '../Header';
import LearnMoreModal from 'components/LearnMoreModal';
import { useModal } from '@ebay/nice-modal-react';
import { TGetLatestSchrodingerListParams, useGetLatestSchrodingerList } from 'graphqlServer';

const pageSize = 32;
export default function List() {
  const [total, setTotal] = useState(0);
  const [current, SetCurrent] = useState(1);
  const [dataSource, setDataSource] = useState<TSGRItem[]>([]);
  const { showLoading, closeLoading, visible: isLoading } = useLoading();
  const cmsInfo = useCmsInfo();
  const gutter = useLatestGutter();
  const column = useLatestColumns();
  const learnMoreModal = useModal(LearnMoreModal);

  const hasMore = useMemo(() => {
    return total > dataSource.length;
  }, [total, dataSource]);

  const getLatestSchrodingerList = useGetLatestSchrodingerList();

  const fetchData = useCallback(
    async ({ params }: { params: TGetLatestSchrodingerListParams['input']; loadMore?: boolean }) => {
      if (!params.chainId) {
        return;
      }
      showLoading();
      try {
        const {
          data: { getLatestSchrodingerListAsync: res },
        } = await getLatestSchrodingerList({
          input: params,
        });
        setTotal(res.totalCount ?? 0);
        const data = (res.data || []).map((item) => {
          return {
            ...item,
            amount: divDecimals(item.amount, item.decimals).toFixed(),
          };
        });
        setDataSource((preData) => [...preData, ...data]);
      } finally {
        closeLoading();
      }
    },
    // There cannot be dependencies showLoading and closeLoading
    [closeLoading, getLatestSchrodingerList, showLoading],
  );

  const requestParams = useMemo(() => {
    return {
      chainId: cmsInfo?.curChain ?? 'tDVV',
      skipCount: getPageNumber(current, pageSize),
      maxResultCount: pageSize,
    };
  }, [cmsInfo?.curChain, current]);

  const loadMoreData = useCallback(() => {
    if (isLoading || !hasMore) return;
    SetCurrent(current + 1);
    fetchData({
      params: {
        ...requestParams,
        skipCount: getPageNumber(current + 1, pageSize),
      },
    });
  }, [current, fetchData, hasMore, isLoading, requestParams]);

  const defaultRequestParams = useMemo(() => {
    let blackList = undefined;
    const params = {
      chainId: cmsInfo?.curChain ?? 'tDVV',
      skipCount: 0,
      maxResultCount: pageSize,
      blackList: undefined,
    };
    try {
      if (!cmsInfo?.blackList) throw 'not config';
      blackList = JSON.parse(cmsInfo?.blackList);
    } catch (error) {
      //
    }
    if (blackList) params.blackList = blackList;
    else delete params.blackList;
    return params;
  }, [cmsInfo?.blackList, cmsInfo?.curChain]);

  const initData = useCallback(() => {
    setDataSource([]);
    fetchData({
      params: defaultRequestParams,
    });
  }, [defaultRequestParams, fetchData]);

  const goForest = useCallback(
    (item: TSGRItem) => {
      learnMoreModal.show({
        item: {
          ...item,
          amount: timesDecimals(item.amount, item.decimals).toFixed(),
        },
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
        // loadMore={loadMoreData}
      />
    </>
  );
}
