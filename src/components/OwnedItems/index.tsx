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
} from 'types/tokensPage';
import { ListTypeEnum } from 'types';
import clsx from 'clsx';
import { Flex, Layout, MenuProps } from 'antd';
import CommonSearch from 'components/CommonSearch';
import { ISubTraitFilterInstance } from 'components/SubTraitFilter';
import FilterTags from '../FilterTags';
import { CollapseForPC, CollapseForPhone } from '../FilterContainer';
import { divDecimals, getPageNumber } from 'utils/calculate';
import { useDebounceFn } from 'ahooks';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as CollapsedSVG } from 'assets/img/collapsed.svg';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import { useWalletService } from 'hooks/useWallet';
import { store } from 'redux/store';
import {
  TGetAllTraitsParams,
  TGetAllTraitsResult,
  TGetTraitsParams,
  TGetTraitsResult,
  useGetAllTraits,
  useGetTraits,
} from 'graphqlServer';
import { ZERO } from 'constants/misc';
import { TSGRItem } from 'types/tokens';
import { ToolTip } from 'aelf-design';
import { catsList, catsListAll, catsListBot, catsListBotAll } from 'api/request';
import ScrollContent from 'components/ScrollContent';
import { CardType } from 'components/ItemCard';
import useColumns from 'hooks/useColumns';
import { EmptyList } from 'components/EmptyList';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import SearchInput from './SearchInput';
import useTelegram from 'hooks/useTelegram';

export default function OwnedItems() {
  const { wallet } = useWalletService();
  // 1024 below is the mobile display
  const { isLG } = useResponsive();
  const isMobile = useMemo(() => isLG, [isLG]);
  const [collapsed, setCollapsed] = useState(!isLG);
  const [ownedTotal, setOwnedTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchParam, setSearchParam] = useState('');
  const cmsInfo = store.getState().info.cmsInfo;
  const curChain = cmsInfo?.curChain || '';
  const [filterList, setFilterList] = useState(getFilterList(curChain));
  const searchParams = useSearchParams();
  const pageState: ListTypeEnum = useMemo(
    () => (Number(searchParams.get('pageState')) as ListTypeEnum) || ListTypeEnum.All,
    [searchParams],
  );

  const pathName = usePathname();
  const isTGPage = pathName === '/telegram';

  const defaultFilter = useMemo(
    () =>
      getDefaultFilter(curChain, {
        needRare: pageState === ListTypeEnum.RARE,
        rarityFilterItems: cmsInfo?.rarityFilterItems,
      }),
    [cmsInfo?.rarityFilterItems, curChain, pageState],
  );

  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);
  const [tempFilterSelect, setTempFilterSelect] = useState<IFilterSelect>(defaultFilter);
  const [current, setCurrent] = useState(1);
  const [dataSource, setDataSource] = useState<TSGRItem[]>();
  const pageSize = 32;
  const gutter = useMemo(() => (isLG ? 12 : 20), [isLG]);
  const column = useColumns(collapsed);
  const router = useRouter();
  const walletAddress = useMemo(() => wallet.address, [wallet.address]);
  const filterListRef = useRef<any>();
  const walletAddressRef = useRef(walletAddress);
  const { isLogin } = useGetLoginStatus();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { isInTG } = useTelegram();

  useEffect(() => {
    walletAddressRef.current = walletAddress;
  }, [walletAddress]);

  const defaultRequestParams = useMemo(() => {
    const filter = getFilter(defaultFilter);
    return {
      ...filter,
      skipCount: 0,
      maxResultCount: pageSize,
    };
  }, [defaultFilter]);

  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect);
    return {
      ...filter,
      skipCount: getPageNumber(current, pageSize),
      maxResultCount: pageSize,
      keyword: searchParam,
    };
  }, [filterSelect, current, searchParam]);

  const fetchData = async ({
    params,
    loadMore = false,
    requestType,
    inTG = false,
  }: {
    params: ICatsListParams;
    loadMore?: boolean;
    requestType: ListTypeEnum;
    inTG?: boolean;
  }) => {
    if (!params.chainId) {
      return;
    }
    if (isInTG && requestType === ListTypeEnum.My && !wallet.address) return;
    const requestCatApi =
      requestType === ListTypeEnum.My ? (inTG ? catsListBot : catsList) : inTG ? catsListBotAll : catsListAll;
    try {
      const res = await requestCatApi({ ...params, address: wallet.address });

      const locationState = location.search.split('pageState=')[1] || ListTypeEnum.All;
      if (requestType !== Number(locationState)) return;

      const total = res.totalCount ?? 0;
      setTotal(total);
      const hasSearch =
        params.traits?.length || params.generations?.length || !!params.keyword || params.rarities?.length;
      if (!hasSearch) {
        setOwnedTotal(total);
      }
      const data = (res.data || []).map((item) => {
        return {
          ...item,
          amount: divDecimals(item.amount, item.decimals).toFixed(),
        };
      });

      if (loadMore) {
        setDataSource((preData) => [...(preData || []), ...data]);
      } else {
        setDataSource(data);
      }
      setCurrent((count) => {
        return ++count;
      });
    } catch {
      setDataSource((preData) => preData || []);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setDataSource([]);
    setTotal(0);
  }, [pageState]);

  useEffect(() => {
    setSearchParam('');
    setFilterSelect(defaultFilter);
    setTempFilterSelect(defaultFilter);
    setLoading(true);
    fetchData({
      params: defaultRequestParams,
      requestType: pageState,
      inTG: isInTG,
    });
  }, [defaultRequestParams, pageState, isLogin, defaultFilter, isInTG]);

  const getTraits = useGetTraits();
  const getAllTraits = useGetAllTraits();

  const getFilterListData = useCallback(
    async ({ type }: { type: ListTypeEnum }) => {
      const currentWalletAddress = walletAddressRef.current;
      const requestApi = type === ListTypeEnum.My ? getTraits : getAllTraits;
      const reqParams: {
        chainId: string;
        address?: string;
      } = {
        chainId: curChain,
        address: currentWalletAddress,
      };
      if (type !== ListTypeEnum.My) {
        delete reqParams.address;
      }
      try {
        const { data } = await requestApi({
          input: reqParams,
        } as TGetTraitsParams & TGetAllTraitsParams);
        const { traitsFilter, generationFilter } =
          type === ListTypeEnum.My ? (data as TGetTraitsResult).getTraits : (data as TGetAllTraitsResult).getAllTraits;
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
          filterListRef.current = newFilterList;
          return newFilterList;
        });
      } catch (error) {
        console.log('getTraitList error', error);
      }
    },
    [curChain, getAllTraits, getTraits],
  );

  useEffect(() => {
    getFilterListData({ type: pageState });
  }, [getFilterListData, pageState]);

  const applyFilter = useCallback(
    (newFilterSelect: IFilterSelect = tempFilterSelect) => {
      setFilterSelect(newFilterSelect);
      const filter = getFilter(newFilterSelect);
      setCurrent(1);
      setLoading(true);
      fetchData({
        params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) },
        requestType: pageState,
        inTG: isInTG,
      });
    },
    [tempFilterSelect, requestParams, pageState, isInTG],
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

  const renderCollapseItemsLabel = useCallback(
    ({ title, tips }: { title: string; tips?: string }) => {
      return (
        <div className="flex items-center h-[26px]">
          {title}
          {tips ? (
            <ToolTip title={tips} trigger={isLG ? 'click' : 'hover'}>
              <div className="px-[8px] h-full flex items-center" onClick={(e) => e.stopPropagation()}>
                <QuestionSVG />
              </div>
            </ToolTip>
          ) : null}
        </div>
      );
    },
    [isLG],
  );

  const collapseItems = useMemo(() => {
    return filterList
      ?.map((item) => {
        const value = tempFilterSelect[item.key]?.data;
        let children: Required<MenuProps>['items'] = [];
        if (item.type === FilterType.Checkbox) {
          const Comp = getComponentByType(item.type);
          if (item.data.length) {
            children = [
              {
                key: item.key,
                label: <Comp dataSource={item} defaultValue={value} onChange={filterChange} />,
              },
            ];
          }
        } else if (item.type === FilterType.MenuCheckbox) {
          const Comp = getComponentByType(item.type);
          if (item.data.length) {
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
        return children.length
          ? {
              key: item.key,
              label: renderCollapseItemsLabel({
                title: item.title,
                tips: item?.tips,
              }),
              children,
            }
          : undefined;
      })
      .filter((i) => i) as ItemType[];
  }, [filterList, tempFilterSelect, renderCollapseItemsLabel, filterChange, compChildRefs]);

  const collapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const { run } = useDebounceFn(
    (value) => {
      setCurrent(1);
      setLoading(true);
      fetchData({
        params: { ...requestParams, keyword: value, skipCount: getPageNumber(1, pageSize) },
        requestType: pageState,
        inTG: isInTG,
      });
    },
    {
      wait: 500,
    },
  );

  const handleBaseClearAll = useCallback(
    (filterData?: IFilterSelect) => {
      setCurrent(1);
      setFilterSelect(filterData || defaultFilter);
      setTempFilterSelect(filterData || defaultFilter);
    },
    [defaultFilter],
  );

  const handleFilterClearAll = useCallback(() => {
    const filterData = getDefaultFilter(curChain);
    handleBaseClearAll(filterData);
    const filter = getFilter(filterData);
    setLoading(true);
    fetchData({
      params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize) },
      requestType: pageState,
      inTG: isInTG,
    });
    setCollapsed(false);
  }, [curChain, handleBaseClearAll, pageState, requestParams, isInTG]);

  const handleTagsClearAll = useCallback(() => {
    const filterData = getDefaultFilter(curChain);
    setSearchParam('');
    handleBaseClearAll(filterData);
    const filter = getFilter(filterData);
    setLoading(true);
    fetchData({
      params: { ...requestParams, ...filter, skipCount: getPageNumber(1, pageSize), keyword: '' },
      requestType: pageState,
      inTG: isInTG,
    });
  }, [curChain, handleBaseClearAll, pageState, requestParams, isInTG]);

  const symbolChange = (e: any) => {
    setSearchParam(e.target.value);
    run(e.target.value);
  };

  const clearSearchChange = () => {
    setSearchParam('');
    setCurrent(1);
    setLoading(true);
    fetchData({
      params: { ...requestParams, keyword: '', skipCount: getPageNumber(1, pageSize) },
      requestType: pageState,
      inTG: isInTG,
    });
  };

  const hasMore = useMemo(() => {
    return !!(dataSource && total > dataSource.length);
  }, [total, dataSource]);

  const tagList = useMemo(() => {
    return getTagList(filterSelect, searchParam);
  }, [filterSelect, searchParam]);

  const loadMoreData = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchData({
      params: {
        ...requestParams,
        skipCount: getPageNumber(current, pageSize),
      },
      loadMore: true,
      requestType: pageState,
      inTG: isInTG,
    });
  }, [loading, loadingMore, hasMore, current, requestParams, pageState, isInTG]);

  const emptyText = useMemo(() => {
    return (
      dataSource && (
        <Flex className="pt-0 lg:pt-6" justify="center" align="center">
          <EmptyList isChannelShow={!ownedTotal} defaultDescription="No inscriptions found" />
        </Flex>
      )
    );
  }, [dataSource, ownedTotal]);

  const onPress = useCallback(
    (item: TSGRItem) => {
      const params = qs.stringify({
        symbol: item.symbol,
        from: pageState === ListTypeEnum.My ? 'my' : 'all',
        source: isTGPage ? 'telegram' : undefined,
      });

      router.push(`/detail?${params}`);
    },
    [pageState, router],
  );

  useEffect(() => {
    // clear all status
    handleBaseClearAll();
  }, [handleBaseClearAll, pageState]);

  const [showTotalAmount, setShowTotalAmount] = useState<boolean>(true);

  const renderTotalAmount = useMemo(() => {
    if (pageState === ListTypeEnum.My) {
      return (
        <div>
          <span className="text-2xl font-semibold pr-[8px]">Owned</span>
          <span className="text-base font-semibold">({total})</span>
        </div>
      );
    }
    return (
      <span className="text-2xl font-semibold min-w-max w-[364px]">{`${total} ${total > 1 ? 'Cats' : 'Cat'}`}</span>
    );
  }, [pageState, total]);

  return (
    <div>
      <Flex
        className="pb-2 border-0 border-b border-solid border-neutralDivider text-neutralTitle w-full"
        align="center"
        justify="space-between">
        {showTotalAmount && isLG ? renderTotalAmount : null}
        {isLG ? (
          <Flex flex={1} gap={16} className="ml-[8px] flex justify-end">
            <Flex
              className="flex-none size-12 border border-solid border-brandDefault rounded-lg cursor-pointer"
              justify="center"
              align="center"
              onClick={collapsedChange}>
              <CollapsedSVG />
            </Flex>
            <SearchInput
              placeholder="Search for an inscription symbol or name"
              value={searchParam}
              onChange={symbolChange}
              onPressEnter={symbolChange}
              showTotalAmount={(value) => {
                setShowTotalAmount(value);
              }}
            />
          </Flex>
        ) : null}
      </Flex>
      <Layout className="relative">
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
            width={collapsed ? 364 : 0}
            trigger={null}>
            <div className="px-4 mb-[12px]">{renderTotalAmount}</div>
            {collapsed && <CollapseForPC items={collapseItems} defaultOpenKeys={DEFAULT_FILTER_OPEN_KEYS} />}
          </Layout.Sider>
        )}

        <Layout className="!bg-[var(--bg-page)] relative">
          <Flex
            className={clsx('bg-neutralWhiteBg z-[50] pb-5 pt-6 lg:pt-5', !isLG && 'sticky top-0')}
            vertical
            gap={12}>
            {isLG ? null : (
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
            )}

            <FilterTags
              tagList={tagList}
              filterSelect={filterSelect}
              clearAll={handleTagsClearAll}
              onchange={filterChange}
              clearSearchChange={clearSearchChange}
            />
          </Flex>
          <ScrollContent
            type={CardType.MY}
            loadingMore={loadingMore}
            loading={loading}
            className={isLG && !tagList.length ? 'mt-[12px]' : ''}
            grid={{ gutter, column }}
            emptyText={loading ? <></> : emptyText}
            onPress={onPress}
            loadMore={loadMoreData}
            ListProps={{ dataSource }}
          />
        </Layout>
      </Layout>
    </div>
  );
}
