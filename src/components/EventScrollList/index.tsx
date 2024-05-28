import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScrollList from 'components/InfiniteScrollList';
import { PAGE_CONTAINER_ID } from 'constants/index';
import { useDebounceFn } from 'ahooks';
import Loading from 'components/Loading';
import EventList from './components/EventList';
import TableEmpty from 'components/TableEmpty';
import clsx from 'clsx';
import { useWalletService } from 'hooks/useWallet';
import { sleep } from '@portkey/utils';

const endMessage = (
  <div className="text-textSecondary text-base font-medium pt-[28px] pb-[28px] text-center">No more yet~</div>
);

const emptyCom = <TableEmpty title="No notifications" description="You don't have notifications yet" />;

function EventScrollList(props?: { useInfiniteScroll?: boolean }) {
  const { useInfiniteScroll = true } = props || {};
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<IActivityListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(0);
  const { wallet } = useWalletService();

  const loader = useMemo(
    () => (
      <div className={clsx('w-full flex justify-center items-center py-[12px]', pageSize <= 1 ? 'pt-[60px]' : '')}>
        <Loading size={pageSize <= 1 ? 'default' : 'small'} />
      </div>
    ),
    [pageSize],
  );

  const getEventList = async (pageSize: number) => {
    try {
      if (loadingMore || !hasMore) return;
      await sleep(1000);
      // TODO: mock
      const res: IActivityList = {
        hasNewActivity: false,
        totalCount: 3,
        items: [
          {
            bannerUrl: 'https://schrodinger-mainnet.s3.ap-northeast-1.amazonaws.com/banner/Banner_ETransfer.png',
            activityName: 'activity name 3',
            activityId: '1',
            beginTime: '1714348800000',
            endTime: '1719619200000',
            isNew: true,
            linkUrl: 'activity-detail-joint',
            linkType: 'link',
          },
          {
            bannerUrl: 'https://schrodinger-mainnet.s3.ap-northeast-1.amazonaws.com/banner/Banner_ETransfer.png',
            activityName: 'activity name 3',
            activityId: '1',
            beginTime: '1714348800000',
            endTime: '1719619200000',
            isNew: false,
            linkUrl: '/activity-detail-portkey',
            linkType: 'link',
          },
          {
            bannerUrl: 'https://schrodinger-mainnet.s3.ap-northeast-1.amazonaws.com/banner/Banner_ETransfer.png',
            activityName: 'activity name 2',
            activityId: '1',
            beginTime: '1715731200000',
            endTime: '1714348800000',
            isNew: false,
            linkUrl: '/activity-detail',
            linkType: 'link',
          },
          {
            bannerUrl: 'https://schrodinger-mainnet.s3.ap-northeast-1.amazonaws.com/banner/Banner_ETransfer.png',
            activityName: 'activity name 1',
            activityId: '1',
            beginTime: '1715731200000',
            endTime: '1714348800000',
            isNew: false,
            linkUrl: '/rank-list',
            linkType: 'link',
          },
        ],
      };
      console.log('=====finally');
      if (pageSize === 1) {
        setDataSource(res.items || []);
      } else {
        setDataSource((data) => {
          return [...data, ...(res?.items || [])];
        });
      }

      if (dataSource.length + res?.items.length === res.totalCount) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreData = async () => {
    try {
      if (loadingMore || !hasMore) return;
      setPageSize((prev) => ++prev);
    } catch (error) {
      /* empty */
    }
  };

  const { run } = useDebounceFn(loadMoreData, {
    wait: 100,
  });

  useEffect(() => {
    if (pageSize) {
      if (pageSize > 1) setLoadingMore(true);
      getEventList(pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const handleScroll = useCallback(
    async (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.scrollHeight - target.scrollTop - target.clientHeight <= 75) {
        run();
      }
    },
    [run],
  );

  const init = async () => {
    try {
      setLoading(true);
      setPageSize(1);
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    document.querySelector(`#${PAGE_CONTAINER_ID}`)?.addEventListener('scroll', handleScroll);
    return () => {
      document.querySelector(`#${PAGE_CONTAINER_ID}`)?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    init();
  }, []);

  if (useInfiniteScroll) {
    return (
      <InfiniteScrollList
        infiniteScrollProps={{
          next: loadMoreData,
          dataLength: dataSource.length,
          hasMore,
          height: '100%',
          loader: (loadingMore || loading) && hasMore ? loader : <></>,
          endMessage: endMessage,
        }}
        listProps={{
          dataSource,
          locale: {
            emptyText: !(loadingMore || loading) ? emptyCom : <></>,
          },
          renderItem: (item) => <EventList {...item} />,
        }}
      />
    );
  } else {
    return (
      <div>
        {dataSource.map((item) => {
          return <EventList key={item.activityId} {...item} />;
        })}
        {(loadingMore || loading) && hasMore ? loader : null}
        {!hasMore && !!dataSource.length && endMessage}
        {!loading && !loadingMore && !dataSource.length && emptyCom}
      </div>
    );
  }
}

export default memo(EventScrollList);
