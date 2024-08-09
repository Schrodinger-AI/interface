import { Pagination, IPaginationProps } from 'aelf-design';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import styles from './index.module.css';
import dynamic from 'next/dynamic';

const DarkSelectDropdown = dynamic(
  async () => {
    const modal = await import('./DarkSelectDropdown').then((module) => module);
    return modal;
  },
  { ssr: false },
) as any;

export default function CommonPagination(
  props: IPaginationProps & {
    theme?: TModalTheme;
  },
) {
  return (
    <div className={clsx(props.theme === 'dark' && styles['pagination-dark'])}>
      {props.theme === 'dark' && <DarkSelectDropdown />}
      <Pagination {...props} />
    </div>
  );
}
