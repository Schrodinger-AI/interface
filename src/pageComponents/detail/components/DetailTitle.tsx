import { TSGRTokenInfo } from 'types/tokens';
import styles from './styles.module.css';
import clsx from 'clsx';
import TextEllipsis from 'components/TextEllipsis';
import { useMemo } from 'react';
import { divDecimals } from 'utils/calculate';
import { renameSymbol } from 'utils/renameSymbol';
import useTelegram from 'hooks/useTelegram';
import { ZERO } from 'constants/misc';
import { TModalTheme } from 'components/CommonModal';

export default function DetailTitle({
  detail,
  fromListAll,
  theme = 'light',
  isBlind = false,
}: {
  detail: TSGRTokenInfo;
  fromListAll: boolean;
  theme?: TModalTheme;
  isBlind?: boolean;
}) {
  const { isInTG } = useTelegram();

  const holderAmountGtZero = useMemo(() => {
    return divDecimals(detail.holderAmount, detail.decimals).gt(ZERO);
  }, [detail.decimals, detail.holderAmount]);

  const amountText = useMemo(() => {
    if (isInTG) {
      return holderAmountGtZero ? 'Amount Owned' : 'Amount';
    }
    return fromListAll ? 'Amount' : 'Amount Owned';
  }, [fromListAll, holderAmountGtZero, isInTG]);

  const amountStr = useMemo(() => {
    if (isInTG) {
      return divDecimals(holderAmountGtZero ? detail.holderAmount : detail.amount, detail.decimals).toFixed();
    }
    if (fromListAll) {
      return divDecimals(detail.amount, detail.decimals).toFixed();
    } else {
      return divDecimals(detail.holderAmount, detail.decimals).toFixed();
    }
  }, [detail.amount, detail.decimals, detail.holderAmount, fromListAll, holderAmountGtZero, isInTG]);

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const symbolText = useMemo(() => {
    if (isInTG && holderAmountGtZero) {
      isBlind;
      if (isBlind) {
        return '';
      }

      return 'Total supply';
    } else {
      return 'Symbol';
    }
  }, [holderAmountGtZero, isBlind, isInTG]);

  const renderSymbol = useMemo(() => {
    return isInTG && holderAmountGtZero ? (
      <div className={clsx(styles.value, 'text-center', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
        {divDecimals(detail.amount, detail.decimals).toFixed()}
      </div>
    ) : (
      <TextEllipsis
        value={renameSymbol(detail.symbol) || ''}
        className={clsx(styles.value, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}
      />
    );
  }, [detail.amount, detail.decimals, detail.symbol, holderAmountGtZero, isDark, isInTG]);

  return (
    <div className="w-full lg:w-[450px] mr-0 lg:mr-[40px] flex justify-between lg:justify-start">
      <div className={styles.card}>
        <div className={clsx(styles.title, isDark ? 'text-pixelsDivider' : 'text-neutralDisable')}>Name</div>
        <TextEllipsis
          value={detail.tokenName}
          className={clsx(styles.value, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}
        />
      </div>
      {symbolText ? (
        <div className={clsx(styles.card, 'ml-[16px]')}>
          <div className={clsx(styles.title, isDark ? 'text-pixelsDivider' : 'text-neutralDisable')}>{symbolText}</div>
          {renderSymbol}
        </div>
      ) : null}

      <div className={clsx(styles.card, 'ml-[16px]')}>
        <div
          className={clsx(
            styles.title,
            'min-w-[102px] whitespace-nowrap text-right',
            isDark ? 'text-pixelsDivider' : 'text-neutralDisable',
          )}>
          {amountText}
        </div>
        <div className={clsx(styles.value, 'text-right', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
          {amountStr}
        </div>
      </div>
    </div>
  );
}
