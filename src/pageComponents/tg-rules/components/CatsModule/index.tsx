/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TSGRItem } from 'types/tokens';
import { catsListAll } from 'api/request';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { divDecimals, getPageNumber } from 'utils/calculate';
import { getDefaultFilter, getFilter } from 'types/tokensPage';
import Loading from 'components/Loading';
import { useCmsInfo } from 'redux/hooks';
import List, { ListGridType } from 'antd/es/list';
import TableEmpty from 'components/TableEmpty';
import InfiniteScrollList from 'components/InfiniteScrollList';
import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import { Radio } from 'antd';
import styles from './index.module.css';
import { RadioChangeEvent } from 'antd/lib/radio/interface';

type IProps = {
  onChange?: (v: string) => void;
  grid?: ListGridType;
};

const endMessage = (
  <div className="text-textSecondary text-base font-medium pt-[28px] pb-[28px] text-center">No more yet~</div>
);

const emptyCom = <TableEmpty description="No items found" theme="none" />;

export default function CatsModule({ onChange }: IProps) {
  const pageSize = 32;
  const { walletInfo } = useConnectWallet();
  const cmsInfo = useCmsInfo();
  const curChain = cmsInfo?.curChain || '';
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState<TSGRItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [current, setCurrent] = useState(1);
  const [value, setValue] = useState();

  const defaultFilter = useMemo(
    () =>
      getDefaultFilter(curChain, {
        rarityFilterItems: cmsInfo?.rarityFilterItems,
      }),
    [cmsInfo?.rarityFilterItems, curChain],
  );

  const defaultRequestParams = useMemo(() => {
    const filter = getFilter(defaultFilter);
    return {
      ...filter,
      skipCount: 0,
      maxResultCount: pageSize,
    };
  }, [defaultFilter]);

  const fetchData = async ({ params, loadMore = false }: { params: ICatsListParams; loadMore?: boolean }) => {
    if (!params.chainId) {
      return;
    }

    try {
      const res = await catsListAll({ ...params, address: walletInfo?.address });

      const total = res.totalCount ?? 0;
      setTotal(total);
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

  const hasMore = useMemo(() => {
    return !!(dataSource && total > dataSource.length);
  }, [total, dataSource]);

  const loadMoreData = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchData({
      params: {
        ...defaultRequestParams,
        skipCount: getPageNumber(current, pageSize),
      },
      loadMore: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadingMore, hasMore, current]);

  useEffect(() => {
    setLoading(true);
    fetchData({
      params: defaultRequestParams,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultRequestParams, defaultFilter]);

  const loader = useMemo(
    () => (
      <div className={clsx('w-full flex justify-center items-center py-[12px]', pageSize <= 1 ? 'pt-[60px]' : '')}>
        <Loading size={pageSize <= 1 ? 'default' : 'middle'} />
      </div>
    ),
    [pageSize],
  );

  const handleChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="h-[415px] overflow-y-auto">
      <p className="text-pixelsWhiteBg text-base font-[11px] mb-[6px]">{dataSource.length} Results</p>
      <InfiniteScrollList
        infiniteScrollProps={{
          next: loadMoreData,
          dataLength: dataSource.length,
          hasMore,
          height: 385,
          loader: (loadingMore || loading) && hasMore ? loader : <></>,
          endMessage: endMessage,
          scrollableTarget: 'scrollableDiv',
          children: (
            <Radio.Group className="w-full" onChange={handleChange} value={value}>
              <List
                grid={{
                  gutter: 15,
                  xs: 2,
                  sm: 2,
                  md: 2,
                }}
                dataSource={dataSource}
                locale={{ emptyText: emptyCom }}
                renderItem={(item) => (
                  <List.Item>
                    <Radio value={item.symbol} className={styles.radioItem}>
                      <SkeletonImage
                        img={item.inscriptionImageUri}
                        tag={`GEN ${item.generation}`}
                        rarity={item.describe}
                        imageSizeType="contain"
                        className={clsx(
                          '!rounded-[8px]',
                          value === item.symbol
                            ? 'border-[2px] border-solid border-pixelsWhiteBg shadow-selectedBoxShadow'
                            : '',
                        )}
                        imageClassName="!rounded-[8px]"
                        tagPosition="small"
                      />
                    </Radio>
                  </List.Item>
                )}
              />
            </Radio.Group>
          ),
        }}
      />
    </div>
  );
}
