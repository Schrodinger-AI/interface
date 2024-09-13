import { ReactNode, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { List, ListProps } from 'antd';
import ItemCard from 'components/ItemCard';
import { TSGRItem } from 'types/tokens';
import { useDebounceFn } from 'ahooks';
import { PAGE_CONTAINER_ID } from 'constants/index';
import { CardType } from 'components/ItemCard';
import styles from './style.module.css';
import { ListGridType } from 'antd/es/list';
import Loading from 'components/Loading';
import { TModalTheme } from 'components/CommonModal';

interface IContentProps {
  type: CardType;
  loadingMore?: boolean;
  loading?: boolean;
  className?: string;
  grid: ListGridType;
  emptyText?: ReactNode;
  theme?: TModalTheme;
  loadMore?: () => void;
  onPress: (item: TSGRItem) => void;
  ListProps: ListProps<TSGRItem>;
  hideTradePrice?: boolean;
}

function ScrollContent(props: IContentProps) {
  const {
    ListProps,
    loadMore = () => null,
    type,
    grid,
    emptyText,
    theme = 'light',
    onPress,
    loading,
    loadingMore,
    hideTradePrice = false,
  } = props;
  const { run } = useDebounceFn(loadMore, {
    wait: 100,
  });

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
        grid={grid}
        locale={{
          emptyText,
        }}
        loading={{
          indicator: (
            <div>
              <Loading size="middle" color={theme === 'dark' ? 'purple' : 'blue'} />
            </div>
          ),
          spinning: loading,
        }}
        renderItem={(item) => (
          <List.Item key={`${item.symbol}`}>
            <ItemCard type={type} item={item} onPress={onPress} theme={theme} hideTradePrice={hideTradePrice} />
          </List.Item>
        )}
        {...ListProps}
      />
      {loadingMore ? (
        <div className="w-full flex justify-center items-center">
          <Loading size="middle" color={theme === 'dark' ? 'purple' : 'blue'} />
        </div>
      ) : null}
    </div>
  );
}

export default ScrollContent;
