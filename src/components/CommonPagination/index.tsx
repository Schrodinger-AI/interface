import { Pagination, IPaginationProps } from 'aelf-design';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import styles from './index.module.css';
import './index.css';

export default function CommonPagination(
  props: IPaginationProps & {
    theme?: TModalTheme;
  },
) {
  return (
    <div className={clsx(props.theme === 'dark' && styles['pagination-dark'])}>
      <Pagination {...props} />
    </div>
  );
}
