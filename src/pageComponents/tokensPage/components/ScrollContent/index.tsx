import { List, ListProps } from 'antd';
import { useCallback, useEffect } from 'react';
import { IToken } from 'types/tokens';
import useColumns from 'hooks/useColumns';
import { useDebounceFn } from 'ahooks';
import clsx from 'clsx';
import { PAGE_CONTAINER_ID } from 'constants/index';

export function ItemsCard() {
  // TODO: card component
  return <div className="h-[316px] border border-solid">card</div>;
}

interface IContentProps {
  collapsed: boolean;
  className?: string;
  InfiniteScrollProps: {
    hasMore: boolean;
    total: number;
    hasSearch?: boolean;
    loadingMore: boolean;
    loading: boolean;
    loadMore: () => void;
    clearFilter?: () => void;
  };
  ListProps: ListProps<IToken>;
}

function ScrollContent(props: IContentProps) {
  const { ListProps, InfiniteScrollProps } = props;
  const { loading, hasMore, loadingMore, loadMore } = InfiniteScrollProps;
  const { run } = useDebounceFn(loadMore, {
    wait: 100,
  });
  const column = useColumns(props.collapsed);
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

  return (
    <div className={clsx('item-card-wrapper', props.className)}>
      <List
        grid={{ gutter: 20, column }}
        // locale={{
        //   emptyText: (
        //     <TableEmpty
        //       type={emptyEnum.nft}
        //       searchText={(hasSearch && 'search') || ''}
        //       clearFilter={clearFilter && clearFilter}
        //     />
        //   ),
        // }}
        renderItem={() => (
          <List.Item>
            <ItemsCard />
          </List.Item>
        )}
        {...ListProps}
      />
      {loading && <div>Loading</div>}
      {!hasMore && loadingMore && ListProps?.dataSource?.length && (
        <div className="text-center w-full text-textDisable font-medium text-base pb-[20px]">No more data</div>
      )}
    </div>
  );
}

export default ScrollContent;
