import { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { Flex, List, ListProps } from 'antd';
import ItemCard, { CardType } from 'components/ItemCard';
import { EmptyList } from 'components/EmptyList';
import { TSGRItem } from 'types/tokens';
import { useRouter } from 'next/navigation';
import useColumns from 'hooks/useColumns';
import useResponsive from 'hooks/useResponsive';
import useLoading from 'hooks/useLoading';
import { useDebounceFn } from 'ahooks';
import { PAGE_CONTAINER_ID } from 'constants/index';
import styles from './index.module.css';

interface IContentProps {
  collapsed: boolean;
  className?: string;
  InfiniteScrollProps: {
    ownedTotal: number;
    loading: boolean;
    loadMore: () => void;
  };
  ListProps: ListProps<TSGRItem>;
}

function ScrollContent(props: IContentProps) {
  const { ListProps, InfiniteScrollProps } = props;
  const { loading, loadMore, ownedTotal } = InfiniteScrollProps;
  const router = useRouter();
  const { run } = useDebounceFn(loadMore, {
    wait: 100,
  });
  const { isLG } = useResponsive();
  const gutter = useMemo(() => (isLG ? 12 : 20), [isLG]);
  const column = useColumns(props.collapsed);
  const { showLoading, closeLoading } = useLoading();

  useEffect(() => {
    if (loading) {
      showLoading();
    } else {
      closeLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
          emptyText: ListProps.dataSource ? (
            <Flex className="pt-0 lg:pt-6" justify="center" align="center">
              <EmptyList isChannelShow={!ownedTotal} defaultDescription="No inscriptions found" />
            </Flex>
          ) : (
            <></>
          ),
        }}
        renderItem={(item) => (
          <List.Item key={`${item.symbol}`}>
            <ItemCard
              type={CardType.MY}
              item={item}
              onPress={() => router.push(`/detail?symbol=${item.symbol}&address=${item.address}`)}
            />
          </List.Item>
        )}
        {...ListProps}
      />
    </div>
  );
}

export default ScrollContent;
