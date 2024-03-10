import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FilterKeyEnum,
  ICompProps,
  IFilterSelect,
  getDefaultFilter,
  getComponentByType,
  getFilter,
  getFilterList,
} from '../../type';
import clsx from 'clsx';
import { Flex, Layout } from 'antd';
import { CollapseForPC, CollapseForPhone } from '../FilterContainer';
import ScrollContent from '../ScrollContent';
import { divDecimals, getPageNumber } from 'utils/calculate';
import { ITokenListParams } from 'api/types';
import { TSGRToken } from 'types/tokens';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as CollapsedSVG } from 'assets/img/collapsed.svg';
import useLoading from 'hooks/useLoading';
import { useWalletService } from 'hooks/useWallet';
import { store } from 'redux/store';
import { addPrefixSuffix } from 'utils/addressFormatting';

const mockData: TSGRToken[] = new Array(32).fill({
  tokenName: 'tokenName',
  symbol: 'symbol',
  inscriptionImage: 'inscriptionImage',
  decimals: 8,
  amount: '123456789',
  generation: 2,
  blockTime: 1,
});

export default function OwnedItems() {
  const { wallet } = useWalletService();
  // 1024 below is the mobile display
  const { isLG, is2XL, is3XL } = useResponsive();
  const [collapsed, setCollapsed] = useState(!isLG);
  const [total, setTotal] = useState(0);
  const cmsInfo = store.getState().info.cmsInfo;
  const curChain = cmsInfo?.curChain || '';
  const filterList = getFilterList(curChain);
  const defaultFilter = useMemo(() => getDefaultFilter(curChain), [curChain]);
  const [filterSelect] = useState<IFilterSelect>(defaultFilter);
  const [current, SetCurrent] = useState(1);
  const [dataSource, setDataSource] = useState<TSGRToken[]>([]);
  const isLoadMore = useRef<boolean>(false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { showLoading, closeLoading, visible: isLoading } = useLoading();
  const pageSize = 32;
  const walletAddress = useMemo(() => addPrefixSuffix(wallet.address), [wallet.address]);
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
    };
  }, [current, filterSelect, walletAddress]);

  const fetchData = useCallback(
    async ({ params, loadMore = false }: { params: ITokenListParams; loadMore?: boolean }) => {
      if (loadMore) {
        setMoreLoading(true);
      } else {
        isLoadMore.current = false;
        // TODO: show loading
        // showLoading();
      }
      try {
        // TODO: fetch data from server
        // const res = await fetchCompositeNftInfos(params);
        const res = {
          total: 100,
          data: mockData,
        };
        setTotal(res.total);
        const data = res.data.map((item) => {
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
        // TODO: close loading
        // closeLoading();
        setMoreLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData({
      params: defaultRequestParams,
    });
  }, [fetchData, defaultRequestParams]);

  const collapseItems = useMemo(() => {
    return filterList?.map((item) => {
      const defaultValue = filterSelect[item.key]?.data;
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
  }, [filterList, filterSelect]);

  const collapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const hasMore = useMemo(() => {
    return total > dataSource.length;
  }, [total, dataSource]);

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
        className="pb-2 mb-5 border-0 border-b border-solid border-neutralDivider text-neutralTitle"
        gap={8}
        align="center">
        <span className="text-2xl font-semibold">Owned Items</span>
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
            className={clsx('!bg-[var(--bg-page)] m-0', collapsed && '!mr-5')}
            width={collapsed ? siderWidth : 0}
            trigger={null}>
            {collapsed && <CollapseForPC items={collapseItems} defaultOpenKeys={Object.values(FilterKeyEnum)} />}
          </Layout.Sider>
        )}
        <Layout className="!bg-[var(--bg-page)] relative">
          <Flex
            className="mb-5 size-12 border border-solid border-brandDefault rounded-lg cursor-pointer"
            justify="center"
            align="center"
            onClick={collapsedChange}>
            <CollapsedSVG />
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
