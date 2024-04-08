import { TSGRToken } from 'types/tokens';
import styles from './styles.module.css';
import clsx from 'clsx';
import TextEllipsis from 'components/TextEllipsis';

export default function DetailTitle({ detail }: { detail: TSGRToken }) {
  return (
    <div className="w-full lg:w-[450px] mr-0 lg:mr-[40px] flex justify-start">
      <div className={styles.card}>
        <div className={styles.title}>Name</div>
        <TextEllipsis value={detail.tokenName} className={styles.value} />
      </div>
      <div className={clsx(styles.card, 'ml-[16px]')}>
        <div className={styles.title}>Symbol</div>
        <TextEllipsis value={detail.symbol} className={styles.value} />
      </div>
    </div>
  );
}
