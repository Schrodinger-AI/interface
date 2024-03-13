import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FilterKeyEnum,
  ICompProps,
  getDefaultFilter,
  getComponentByType,
  getFilter,
  getFilterList,
  IFilterSelect,
  ItemsSelectSourceType,
  getTagList,
} from '../../type';
import clsx from 'clsx';
import { Flex, Layout } from 'antd';
import CommonSearch from 'components/CommonSearch';
import FilterTags from '../FilterTags';
import { CollapseForPC, CollapseForPhone } from '../FilterContainer';
import ScrollContent from '../ScrollContent';
import { divDecimals, getPageNumber } from 'utils/calculate';
import { TBaseSGRToken } from 'types/tokens';
import { useDebounceFn } from 'ahooks';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as CollapsedSVG } from 'assets/img/collapsed.svg';
import useLoading from 'hooks/useLoading';
import { useWalletService } from 'hooks/useWallet';
import { store } from 'redux/store';
import { sleep } from 'utils';
import { TGetSchrodingerListParams, useGetSchrodingerList } from 'graphqlServer';

const mockData: TBaseSGRToken[] = new Array(32).fill({
  tokenName: 'tokenName',
  symbol: 'symbol',
  inscriptionImage: '',
  decimals: 8,
  amount: '123456789000000',
  generation: 2,
  blockTime: 1,
});

export default function OwnedItems() {
  const { wallet } = useWalletService();
  // 1024 below is the mobile display
  const { isLG, is2XL, is3XL } = useResponsive();
  const [collapsed, setCollapsed] = useState(!isLG);
  const [total, setTotal] = useState(0);
  const [searchParam, setSearchParam] = useState('');
  const cmsInfo = store.getState().info.cmsInfo;
  const curChain = cmsInfo?.curChain || '';
  const filterList = getFilterList(curChain);
  const defaultFilter = useMemo(() => getDefaultFilter(curChain), [curChain]);
  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);
  const [current, SetCurrent] = useState(1);
  const [dataSource, setDataSource] = useState<TBaseSGRToken[]>([]);
  const isLoadMore = useRef<boolean>(false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { showLoading, closeLoading, visible: isLoading } = useLoading();
  const pageSize = 32;
  const walletAddress = useMemo(() => wallet.address, [wallet.address]);
  const siderWidth = useMemo(() => {
    if (is2XL) {
      return 440;
    } else if (is3XL) {
      return 420;
    } else {
      return 445;
    }
  }, [is2XL, is3XL]);
  const defaultRequestParams = useMemo(() => {
    const filter = getFilter(defaultFilter);
    return {
      ...filter,
      address: walletAddress,
      skipCount: 0,
      maxResultCount: pageSize,
    };
  }, [defaultFilter, walletAddress]);
  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect);
    return {
      ...filter,
      address: walletAddress,
      skipCount: getPageNumber(current, pageSize),
      maxResultCount: pageSize,
      keyword: searchParam,
    };
  }, [filterSelect, walletAddress, current, searchParam]);

  const getSchrodingerList = useGetSchrodingerList();

  const fetchData = useCallback(
    async ({ params, loadMore = false }: { params: TGetSchrodingerListParams['input']; loadMore?: boolean }) => {
      if (!params.chainId || !params.address) {
        return;
      }
      if (loadMore) {
        setMoreLoading(true);
      } else {
        isLoadMore.current = false;
        showLoading();
      }
      // await sleep(1000);
      try {
        const {
          data: { getSchrodingerList: res },
        } = await getSchrodingerList({
          input: params,
        });
        // const res = {
        //   data: mockData,
        //   totalCount: 100,
        // };
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

  useEffect(() => {
    fetchData({
      params: defaultRequestParams,
    });
  }, [fetchData, defaultRequestParams]);

  const filterChange = useCallback(
    (val: ItemsSelectSourceType) => {
      setFilterSelect({ ...filterSelect, ...val });
      const filter = getFilter({ ...filterSelect, ...val });
      SetCurrent(1);
      fetchData({ params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) } });
    },
    [filterSelect, fetchData, requestParams],
  );

  const collapseItems = useMemo(() => {
    return filterList?.map((item) => {
      const defaultValue = defaultFilter[item.key]?.data;
      const Comp: React.FC<ICompProps> = getComponentByType(item.type);
      return {
        key: item.key,
        label: item.title,
        children: [
          {
            key: item.key + '-1',
            label: <Comp dataSource={item} defaultValue={defaultValue} />,
          },
        ],
      };
    });
  }, [filterList, defaultFilter]);

  const collapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const { run } = useDebounceFn(
    (value) => {
      SetCurrent(1);
      fetchData({ params: { ...requestParams, keyword: value, skipCount: getPageNumber(1, pageSize) } });
    },
    {
      wait: 500,
    },
  );

  const clearAll = useCallback(() => {
    SetCurrent(1);
    setSearchParam('');
    setFilterSelect({ ...defaultFilter });
    const filter = getFilter({ ...defaultFilter });
    fetchData({ params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize), keyword: '' } });
    if (isLG) setCollapsed(false);
  }, [setFilterSelect, isLG, requestParams, defaultFilter, fetchData]);

  const symbolChange = (e: any) => {
    setSearchParam(e.target.value);
    run(e.target.value);
  };

  const clearSearchChange = () => {
    setSearchParam('');
    SetCurrent(1);
    fetchData({ params: { ...requestParams, keyword: '', skipCount: getPageNumber(1, pageSize) } });
  };

  const hasMore = useMemo(() => {
    return total > dataSource.length;
  }, [total, dataSource]);

  const tagList = useMemo(() => {
    return getTagList(filterSelect, searchParam);
  }, [filterSelect, searchParam]);

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

  return (
    <div>
      <Flex
        className="pb-2 border-0 border-b border-solid border-neutralDivider text-neutralTitle"
        gap={8}
        align="center">
        <span className="text-2xl font-semibold">Amount Owned</span>
        <span className="text-base font-semibold">({total})</span>
      </Flex>
      <Layout>
        {isLG ? (
          <CollapseForPhone
            items={collapseItems}
            defaultOpenKeys={Object.values(FilterKeyEnum)}
            showDropMenu={collapsed}
            onCloseHandler={() => {
              setCollapsed(false);
            }}
          />
        ) : (
          <Layout.Sider
            collapsedWidth={0}
            className={clsx('!bg-[var(--bg-page)] m-0 mt-5', collapsed && '!mr-5')}
            width={collapsed ? siderWidth : 0}
            trigger={null}>
            {collapsed && <CollapseForPC items={collapseItems} defaultOpenKeys={Object.values(FilterKeyEnum)} />}
          </Layout.Sider>
        )}
        <Layout className="!bg-[var(--bg-page)] relative">
          <Flex className="sticky top-[60px] lg:top-[80px] bg-neutralWhiteBg z-[5] pb-5 pt-6 lg:pt-5" vertical gap={12}>
            <Flex gap={16}>
              <Flex
                className="flex-none size-12 border border-solid border-brandDefault rounded-lg cursor-pointer"
                justify="center"
                align="center"
                onClick={collapsedChange}>
                <CollapsedSVG />
              </Flex>
              <CommonSearch
                placeholder="Search for an inscription symbol or name"
                value={searchParam}
                onChange={symbolChange}
                onPressEnter={symbolChange}
              />
            </Flex>
            <FilterTags
              tagList={tagList}
              filterSelect={filterSelect}
              clearAll={clearAll}
              onchange={filterChange}
              clearSearchChange={clearSearchChange}
            />
          </Flex>
          <ScrollContent
            collapsed={collapsed}
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
        </Layout>
      </Layout>
    </div>
  );
}
