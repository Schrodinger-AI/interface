import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getDefaultFilter,
  getComponentByType,
  getFilter,
  getFilterList,
  IFilterSelect,
  ItemsSelectSourceType,
  getTagList,
  DEFAULT_FILTER_OPEN_KEYS,
  FilterType,
  MenuCheckboxItemDataType,
  FilterKeyEnum,
  CheckboxItemType,
} from '../../type';
import clsx from 'clsx';
import { Flex, Layout, MenuProps } from 'antd';
import CommonSearch from 'components/CommonSearch';
import { ISubTraitFilterInstance } from 'components/SubTraitFilter';
import FilterTags from '../FilterTags';
import { CollapseForPC, CollapseForPhone } from '../FilterContainer';
import FilterMenuEmpty from '../FilterMenuEmpty';
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
import { TGetSchrodingerListParams, useGetSchrodingerList, useGetTraits } from 'graphqlServer';
import { ZERO } from 'constants/misc';

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
  const isMobile = useMemo(() => isLG, [isLG]);
  const [collapsed, setCollapsed] = useState(!isLG);
  const [total, setTotal] = useState(0);
  const [searchParam, setSearchParam] = useState('');
  const cmsInfo = store.getState().info.cmsInfo;
  const curChain = cmsInfo?.curChain || '';
  const [filterList, setFilterList] = useState(getFilterList(curChain));
  const defaultFilter = useMemo(() => getDefaultFilter(curChain), [curChain]);
  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);
  const [tempFilterSelect, setTempFilterSelect] = useState<IFilterSelect>(defaultFilter);
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

  const getTraits = useGetTraits();

  const getFilterListData = useCallback(async () => {
    try {
      const {
        data: {
          getTraits: { traitsFilter, generationFilter },
        },
      } = await getTraits({
        input: {
          chainId: curChain,
          address: walletAddress,
        },
      });
      const traitsList =
        traitsFilter?.map((item) => ({
          label: item.traitType,
          value: item.traitType,
          count: ZERO.plus(item.amount).toFormat(),
        })) || [];
      const generationList =
        generationFilter?.map((item) => ({
          label: String(item.generationName),
          value: item.generationName,
          count: ZERO.plus(item.generationAmount).toFormat(),
        })) || [];
      setFilterList((preFilterList) => {
        const newFilterList = preFilterList.map((item) => {
          if (item.key === FilterKeyEnum.Traits) {
            return { ...item, data: traitsList };
          } else if (item.key === FilterKeyEnum.Generation) {
            return { ...item, data: generationList } as CheckboxItemType;
          }
          return item;
        });
        return newFilterList;
      });
    } catch (error) {
      console.log('getTraitList error', error);
    }
  }, [curChain, getTraits, walletAddress]);

  useEffect(() => {
    getFilterListData();
  }, [getFilterListData]);

  const applyFilter = useCallback(
    (newFilterSelect: IFilterSelect = tempFilterSelect) => {
      setFilterSelect(newFilterSelect);
      const filter = getFilter(newFilterSelect);
      SetCurrent(1);
      fetchData({ params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) } });
    },
    [tempFilterSelect, fetchData, requestParams],
  );

  const filterChange = useCallback(
    (val: ItemsSelectSourceType) => {
      const newFilterSelect = { ...filterSelect, ...val };
      setTempFilterSelect(newFilterSelect);
      if (!isMobile || !collapsed) {
        applyFilter(newFilterSelect);
      }
    },
    [filterSelect, isMobile, collapsed, applyFilter],
  );

  const compChildRefs = useMemo(() => {
    const refs: { [key: string]: React.RefObject<ISubTraitFilterInstance> } = {};
    filterList?.forEach((item) => {
      if (item.type === FilterType.MenuCheckbox && item.data.length > 0) {
        item.data.forEach((subItem) => {
          refs[subItem.value] = React.createRef();
        });
      }
    });
    return refs;
  }, [filterList]);

  const clearAllCompChildSearches = useCallback(() => {
    Object.values(compChildRefs).forEach((ref) => {
      ref.current?.clearSearch?.();
    });
  }, [compChildRefs]);

  useEffect(() => {
    if (isMobile && !collapsed) {
      clearAllCompChildSearches();
    }
  }, [isMobile, collapsed, clearAllCompChildSearches]);

  const collapseItems = useMemo(() => {
    return filterList?.map((item) => {
      const value = tempFilterSelect[item.key]?.data;
      let children: Required<MenuProps>['items'] = [];
      if (item.type === FilterType.Checkbox) {
        const Comp = getComponentByType(item.type);
        children = [
          {
            key: item.key,
            label: <Comp dataSource={item} defaultValue={value} onChange={filterChange} />,
          },
        ];
      } else if (item.type === FilterType.MenuCheckbox) {
        const Comp = getComponentByType(item.type);
        if (item.data.length === 0) {
          children = [
            {
              key: item.key,
              label: <FilterMenuEmpty />,
            },
          ];
        } else {
          children = item.data.map((subItem) => {
            return {
              key: subItem.value,
              label: <Comp label={subItem.label} count={subItem.count} />,
              children: [
                {
                  key: subItem.value,
                  label: (
                    <Comp.child
                      ref={compChildRefs[subItem.value]}
                      itemKey={item.key}
                      parentLabel={subItem.label}
                      parentValue={subItem.value}
                      value={value as MenuCheckboxItemDataType[]}
                      onChange={filterChange}
                    />
                  ),
                },
              ],
            };
          });
        }
      }
      return {
        key: item.key,
        label: item.title,
        children,
      };
    });
  }, [filterList, tempFilterSelect, filterChange, compChildRefs]);

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

  const handleBaseClearAll = useCallback(() => {
    SetCurrent(1);
    setFilterSelect(defaultFilter);
    setTempFilterSelect(defaultFilter);
  }, [defaultFilter]);

  const handleFilterClearAll = useCallback(() => {
    handleBaseClearAll();
    const filter = getFilter(defaultFilter);
    fetchData({ params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) } });
    setCollapsed(false);
  }, [defaultFilter, fetchData, handleBaseClearAll, requestParams]);

  const handleTagsClearAll = useCallback(() => {
    setSearchParam('');
    handleBaseClearAll();
    const filter = getFilter(defaultFilter);
    fetchData({ params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize), keyword: '' } });
  }, [defaultFilter, fetchData, handleBaseClearAll, requestParams]);

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
        {isMobile ? (
          <CollapseForPhone
            items={collapseItems}
            defaultOpenKeys={DEFAULT_FILTER_OPEN_KEYS}
            showDropMenu={collapsed}
            onCloseHandler={() => {
              setCollapsed(false);
              setTempFilterSelect(filterSelect);
            }}
            handleClearAll={handleFilterClearAll}
            handleApply={() => {
              applyFilter();
              setCollapsed(false);
            }}
          />
        ) : (
          <Layout.Sider
            collapsedWidth={0}
            className={clsx('!bg-[var(--bg-page)] m-0 mt-5', collapsed && '!mr-5')}
            width={collapsed ? siderWidth : 0}
            trigger={null}>
            {collapsed && <CollapseForPC items={collapseItems} defaultOpenKeys={DEFAULT_FILTER_OPEN_KEYS} />}
          </Layout.Sider>
        )}
        <Layout className="!bg-[var(--bg-page)] relative">
          <Flex className="sticky top-0 bg-neutralWhiteBg z-[50] pb-5 pt-6 lg:pt-5" vertical gap={12}>
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
              clearAll={handleTagsClearAll}
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
              hasSearch: !!tagList.length,
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
