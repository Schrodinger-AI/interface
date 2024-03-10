import { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { Flex, List, ListProps } from 'antd';
import ItemCard from 'components/ItemCard';
import { EmptyList } from 'components/EmptyList';
import { IToken } from 'types/tokens';
import useColumns from 'hooks/useColumns';
import useResponsive from 'hooks/useResponsive';
import { useDebounceFn } from 'ahooks';
import { PAGE_CONTAINER_ID } from 'constants/index';
import styles from './index.module.css';

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
  const { isLG } = useResponsive();
  const gutter = useMemo(() => (isLG ? 12 : 20), [isLG]);
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
    <div className={clsx(styles.cardListWrapper, props.className)}>
      <List
        grid={{ gutter, column }}
        locale={{
          emptyText: (
            <Flex justify="center" align="center">
              <EmptyList isChannelShow />
            </Flex>
          ),
        }}
        renderItem={(item) => (
          <List.Item>
            <ItemCard item={item} onPress={() => void 0} />
          </List.Item>
        )}
        {...ListProps}
      />
      {loading && <div>Loading</div>}
    </div>
  );
}

export default ScrollContent;
