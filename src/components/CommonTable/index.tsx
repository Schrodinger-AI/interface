import { Table, ITableProps } from 'aelf-design';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import styles from './index.module.css';
import { AnyObject } from 'antd/es/_util/type';
import Loading from 'components/Loading';

export default function CommonTable<T extends AnyObject>(
  props: ITableProps<T> & {
    theme?: TModalTheme;
  },
) {
  return (
    <Table
      rootClassName={clsx(props.theme === 'dark' && styles['table-dark'])}
      {...props}
      loading={{
        indicator: (
          <div>
            <Loading size="middle" color={props.theme === 'dark' ? 'purple' : 'blue'} />
          </div>
        ),
        spinning: !!props.loading,
      }}
    />
  );
}
