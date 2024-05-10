import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScrollList from 'components/InfiniteScrollList';
import { PAGE_CONTAINER_ID } from 'constants/index';
import { useDebounceFn } from 'ahooks';
import Loading from 'components/Loading';
import NoticeList from './components/NoticeList';
import TableEmpty from 'components/TableEmpty';
import clsx from 'clsx';
import { useWalletService } from 'hooks/useWallet';
import { getMessageUnreadCount } from 'utils/getMessageUnreadCount';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import { messageList } from 'api/request';

const endMessage = (
  <div className="text-textSecondary text-base font-medium pt-[28px] pb-[28px] text-center">No more yet~</div>
);

const emptyCom = <TableEmpty title="No notifications" description="You don't have notifications yet" />;

function NoticeScrollList(props?: { useInfiniteScroll?: boolean }) {
  const { useInfiniteScroll = true } = props || {};
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<ITransactionMessageListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(0);
  const { wallet } = useWalletService();
  const { unreadMessagesCount } = useGetStoreInfo();

  const loader = useMemo(
    () => (
      <div className={clsx('w-full flex justify-center items-center py-[12px]', pageSize <= 1 ? 'pt-[60px]' : '')}>
        <Loading size={pageSize <= 1 ? 'default' : 'small'} />
      </div>
    ),
    [pageSize],
  );

  const getNoticeList = async (pageSize: number) => {
    try {
      if (loadingMore || !hasMore) return;
      const res = await messageList({
        address: wallet.address,
        skipCount: (pageSize - 1) * 20,
        maxResultCount: 20,
      });
      if (pageSize === 1) {
        setDataSource(res.data || []);
      } else {
        setDataSource((data) => {
          return [...data, ...(res?.data || [])];
        });
      }

      if (dataSource.length + res?.data.length === res.totalCount) {
        setHasMore(false);
      }
    } catch (error) {
      /* empty */
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreData = async () => {
    try {
      if (!hasMore) return;
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
      getNoticeList(pageSize);
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

  const init = async (address: string) => {
    try {
      setLoading(true);
      await getMessageUnreadCount(address);
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
    if (!wallet.address) return;
    init(wallet.address);
  }, [wallet.address]);

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
          renderItem: (item, index) => <NoticeList {...item} isUnread={index < unreadMessagesCount} />,
        }}
      />
    );
  } else {
    return (
      <div>
        {dataSource.map((item, index) => {
          return <NoticeList key={index} {...item} isUnread={index < unreadMessagesCount} />;
        })}
        {(loadingMore || loading) && hasMore ? loader : null}
        {!hasMore && !!dataSource.length && endMessage}
        {!loading && !loadingMore && !dataSource.length && emptyCom}
      </div>
    );
  }
}

export default memo(NoticeScrollList);
