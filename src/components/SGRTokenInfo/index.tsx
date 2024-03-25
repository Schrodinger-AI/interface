import React from 'react';
import styles from './index.module.css';
export interface ISGRTokenInfoProps {
  tokenName?: string;
  symbol?: string;
  amount?: string | number;
}

function SGRTokenInfo({ tokenName, symbol, amount }: ISGRTokenInfoProps) {
  return (
    <div className={styles['token-info']}>
      <div className="text-lg font-medium text-neutralTitle">Info</div>
      <div className="mt-[16px]">
        <div className={styles.item}>
          <span className={styles.title}>Name</span>
          <span className={styles.value}>{tokenName ?? '--'}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.title}>Symbol</span>
          <span className={styles.value}>{symbol ?? '--'}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.title}>Amount Owned</span>
          <span className={styles.value}>{amount ?? '--'}</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SGRTokenInfo);
