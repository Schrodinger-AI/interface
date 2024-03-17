import { useMemo } from 'react';
import { TSGRToken } from 'types/tokens';
import { divDecimals } from 'utils/calculate';
import styles from './styles.module.css';
import clsx from 'clsx';

export default function DetailTitle({ detail }: { detail: TSGRToken }) {
  const amountStr = useMemo(
    () => divDecimals(detail.amount, detail.decimals).toFixed(),
    [detail.amount, detail.decimals],
  );

  return (
    <div className="w-full mr-0 lg:mr-[12px] h-[58px] lg:h-[68px] flex justify-between lg:justify-start">
      <div className={styles.card}>
        <div className={styles.title}>Name</div>
        <div className={styles.value}>{detail.tokenName}</div>
      </div>
      <div className={clsx(styles.card, 'ml-[16px] lg:ml-[68px]')}>
        <div className={styles.title}>Symbol</div>
        <div className={styles.value}>{detail.symbol}</div>
      </div>
      <div className={clsx(styles.card, 'ml-[16px] lg:ml-[68px]')}>
        <div className={clsx(styles.title, 'min-w-[102px]')}>Amount Owned</div>
        <div className={clsx(styles.value, 'text-right lg:text-left')}>{amountStr}</div>
      </div>
    </div>
  );
}
