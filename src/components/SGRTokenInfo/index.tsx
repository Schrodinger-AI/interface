import React, { useMemo } from 'react';
import styles from './index.module.css';
import { getRankInfoToShow } from 'utils/formatTraits';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
export interface ISGRTokenInfoProps {
  tokenName?: string;
  symbol?: string;
  amount?: string | number;
  rankInfo?: IRankInfo;
  theme?: TModalTheme;
}

function SGRTokenInfo({ tokenName, symbol, amount, rankInfo, theme }: ISGRTokenInfoProps) {
  const isDark = useMemo(() => theme === 'dark', [theme]);
  return (
    <div className={styles['token-info']}>
      <div className={clsx('text-lg font-medium text-neutralTitle', isDark && 'dark-title')}>Info</div>
      <div className="mt-[16px]">
        <div className={styles.item}>
          <span className={clsx(styles.title, isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>Name</span>
          <span className={clsx(styles.value, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
            {tokenName ?? '--'}
          </span>
        </div>
        <div className={styles.item}>
          <span className={clsx(styles.title, isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>Symbol</span>
          <span className={clsx(styles.value, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
            {symbol ?? '--'}
          </span>
        </div>
        <div className={styles.item}>
          <span className={clsx(styles.title, isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
            Amount Owned
          </span>
          <span className={clsx(styles.value, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
            {amount ?? '--'}
          </span>
        </div>
        {rankInfo?.rank ? (
          <div className={styles.item}>
            <span className={clsx(styles.title, isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>Rank</span>
            <span className={clsx(styles.value, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              {getRankInfoToShow(rankInfo)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(SGRTokenInfo);
