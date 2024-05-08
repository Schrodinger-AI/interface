import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScrollList from 'components/InfiniteScrollList';
import { sleep } from '@portkey/utils';
import { PAGE_CONTAINER_ID } from 'constants/index';
import { useDebounceFn } from 'ahooks';
import Loading from 'components/Loading';
import NoticeList from './components/NoticeList';
import TableEmpty from 'components/TableEmpty';
import clsx from 'clsx';

const endMessage = (
  <div className="text-textSecondary text-base font-medium pt-[28px] pb-[28px] text-center">No more yet~</div>
);

const emptyCom = <TableEmpty title="No notifications" description="You don't have notifications yet" />;

// TODO: mock data
const dataSource1 = ['111', '222', '333', '444', '555', '666', '777', '888', '999', '101010'];
const dataSource2 = [
  '111111',
  '121212',
  '131313',
  '141414',
  '151515',
  '161616',
  '171717',
  '181818',
  '191919',
  '202020',
];

function NoticeScrollList(props?: { useInfiniteScroll?: boolean }) {
  const { useInfiniteScroll = true } = props || {};
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState<number>(1);

  const loader = useMemo(
    () => (
      <div className={clsx('w-full flex justify-center items-center py-[12px]', pageSize === 1 ? 'pt-[60px]' : '')}>
        <Loading size={pageSize === 1 ? 'default' : 'small'} />
      </div>
    ),
    [pageSize],
  );

  const getNoticeList = async (pageSize: number) => {
    let data: string[] = [];
    try {
      if (pageSize === 1) {
        setLoading(true);
        await sleep(1000);
        data = dataSource1;
      } else {
        setLoading(true);
        await sleep(1000);
        data = dataSource1.concat(dataSource2);
        setHasMore(false);
      }
    } catch (error) {
      /* empty */
    } finally {
      setLoading(false);
      setDataSource(data);
    }
  };

  const loadMoreData = async () => {
    try {
      if (!hasMore) return;
      console.log('=====loadMoreData');
      setPageSize((prev) => ++prev);
    } catch (error) {
      /* empty */
    }
  };

  const { run } = useDebounceFn(loadMoreData, {
    wait: 100,
  });

  useEffect(() => {
    getNoticeList(pageSize);
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
  useEffect(() => {
    document.querySelector(`#${PAGE_CONTAINER_ID}`)?.addEventListener('scroll', handleScroll);
    return () => {
      document.querySelector(`#${PAGE_CONTAINER_ID}`)?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (useInfiniteScroll) {
    return (
      <InfiniteScrollList
        infiniteScrollProps={{
          next: loadMoreData,
          dataLength: dataSource.length,
          hasMore,
          height: '100%',
          loader,
          endMessage: endMessage,
        }}
        listProps={{
          dataSource,
          locale: {
            emptyText: !loading ? emptyCom : <></>,
          },
          renderItem: (item) => (
            <NoticeList
              data={{
                img: 'https://schrodinger-testnet.s3.amazonaws.com/watermarkimage/QmaT8NNadFqh3kioM54ZQZx7CkiEBZYc5uGNbZh836HNEz',
                name: item,
                symbol: 'SGRTEST-8380',
              }}
            />
          ),
        }}
      />
    );
  } else {
    return (
      <div>
        {dataSource.map((item, index) => {
          return (
            <NoticeList
              key={index}
              data={{
                img: 'https://schrodinger-testnet.s3.amazonaws.com/watermarkimage/QmaT8NNadFqh3kioM54ZQZx7CkiEBZYc5uGNbZh836HNEz',
                name: item,
                symbol: 'SGRTEST-8380',
              }}
            />
          );
        })}
        {loading && hasMore && loader}
        {!hasMore && !!dataSource.length && endMessage}
        {!loading && !dataSource.length && emptyCom}
      </div>
    );
  }
}

export default memo(NoticeScrollList);
