/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TSGRItem } from 'types/tokens';
import { catsBlindListAll, catsList, catsListBot } from 'api/request';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { divDecimals, getPageNumber } from 'utils/calculate';
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
import useTelegram from 'hooks/useTelegram';
import { TModalTheme } from 'components/CommonModal';
import { TSelectedCatInfo } from '../BreedModule';

type IProps = {
  onChange?: (data: TSelectedCatInfo) => void;
  grid?: ListGridType;
  type?: 'myCats' | 'box';
  selectedType?: 'myCats' | 'box';
  selectedSymbol?: string;
  theme?: TModalTheme;
};

const endMessage = (theme: TModalTheme) => (
  <div
    className={clsx(
      'text-base font-medium pt-[28px] pb-[28px] text-center',
      theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-textSecondary',
    )}>
    No more yet~
  </div>
);

const emptyCom = (theme: TModalTheme) => {
  return <TableEmpty description="No item found" theme={theme} />;
};

export default function CatsModule({ onChange, type, selectedSymbol, selectedType, theme = 'light' }: IProps) {
  const pageSize = 32;
  const { walletInfo } = useConnectWallet();
  const cmsInfo = useCmsInfo();
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState<TSGRItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [current, setCurrent] = useState(1);
  const [currentData, setCurrentData] = useState<TSGRItem>();
  const { isInTG } = useTelegram();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const defaultRequestParams = useMemo(() => {
    return {
      minAmount: '100000000',
      skipCount: 0,
      maxResultCount: pageSize,
      chainId: cmsInfo?.curChain || 'tDVV',
    };
  }, [cmsInfo?.curChain]);

  const fetchData = async ({ params, loadMore = false }: { params: ICatsListParams; loadMore?: boolean }) => {
    if (!params.chainId) {
      return;
    }

    try {
      let requestMyCatApi;
      if (isInTG) {
        requestMyCatApi = catsListBot;
      } else {
        requestMyCatApi = catsList;
      }

      const res =
        type === 'box'
          ? await catsBlindListAll({
              ...params,
              generation: 9,
              address: walletInfo?.address,
            })
          : await requestMyCatApi({
              ...params,
              generations: [9],
              address: walletInfo?.address,
            });

      const totalCount = res.totalCount ?? 0;
      if (totalCount) setTotal(totalCount);

      const data = (res.data || [])
        .filter((item) => item.symbol !== selectedSymbol)
        .map((item) => {
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
  }, [defaultRequestParams]);

  const loader = useMemo(
    () => (
      <div className={clsx('w-full flex justify-center items-center py-[12px]', pageSize <= 1 ? 'pt-[60px]' : '')}>
        <Loading size={pageSize <= 1 ? 'default' : 'middle'} />
      </div>
    ),
    [pageSize],
  );

  const handleChange = (e: RadioChangeEvent) => {
    const value: TSGRItem = e.target.value;
    setCurrentData(value);
    onChange?.({ ...value, type: type || 'box' });
  };

  const formatTotal = useMemo(() => {
    if (selectedType && selectedType === type && total) {
      return total - 1;
    }
    return total;
  }, [selectedType, total, type]);

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      {dataSource.length ? (
        <p className={clsx('text-base font-[11px] mb-[6px]', isDark ? 'text-pixelsWhiteBg' : 'text-neutralPrimary')}>
          {formatTotal} Result
        </p>
      ) : null}

      {loading ? (
        <div className="flex-1 w-full flex justify-center items-center">
          <Loading size={'default'} />
        </div>
      ) : (
        <div className={clsx(styles['infinite-scroll-list-wrap'])}>
          <InfiniteScrollList
            infiniteScrollProps={{
              next: loadMoreData,
              dataLength: dataSource.length,
              hasMore,
              loader: (loadingMore || loading) && hasMore ? loader : <></>,
              endMessage: endMessage(theme),
              scrollableTarget: 'scrollableDiv',
              children: (
                <Radio.Group className="w-full" onChange={handleChange} value={currentData}>
                  <List
                    grid={{
                      xs: 2,
                    }}
                    dataSource={dataSource}
                    locale={{ emptyText: emptyCom(theme) }}
                    renderItem={(item) => (
                      <List.Item>
                        <Radio value={item} className={styles.radioItem}>
                          <SkeletonImage
                            img={item.inscriptionImageUri}
                            tag={`GEN ${item.generation}`}
                            rarity={item.describe}
                            imageSizeType="contain"
                            className={clsx(
                              '!rounded-[8px]',
                              currentData?.symbol === item.symbol
                                ? 'border-[2px] border-solid border-pixelsButtonSuccess shadow-selectedBoxShadow'
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
      )}
    </div>
  );
}
