import { Table, ITableProps } from 'aelf-design';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import styles from './index.module.css';
import { AnyObject } from 'antd/es/_util/type';

export default function CommonTable<T extends AnyObject>(
  props: ITableProps<T> & {
    theme?: TModalTheme;
  },
) {
  return <Table rootClassName={clsx(props.theme === 'dark' && styles['table-dark'])} {...props} />;
}
