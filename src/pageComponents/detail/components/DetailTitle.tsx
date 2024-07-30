import { TSGRTokenInfo } from 'types/tokens';
import styles from './styles.module.css';
import clsx from 'clsx';
import TextEllipsis from 'components/TextEllipsis';
import { useMemo } from 'react';
import { divDecimals } from 'utils/calculate';
import { renameSymbol } from 'utils/renameSymbol';
import useTelegram from 'hooks/useTelegram';
import { ZERO } from 'constants/misc';

export default function DetailTitle({ detail, fromListAll }: { detail: TSGRTokenInfo; fromListAll: boolean }) {
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

  const symbolText = useMemo(() => {
    return isInTG && holderAmountGtZero ? 'Total supply' : 'Symbol';
  }, [holderAmountGtZero, isInTG]);

  const renderSymbol = useMemo(() => {
    return isInTG && holderAmountGtZero ? (
      <div className={clsx(styles.value, 'text-center')}>{divDecimals(detail.amount, detail.decimals).toFixed()}</div>
    ) : (
      <TextEllipsis value={renameSymbol(detail.symbol) || ''} className={clsx(styles.value)} />
    );
  }, [detail.amount, detail.decimals, detail.symbol, holderAmountGtZero, isInTG]);

  return (
    <div className="w-full lg:w-[450px] mr-0 lg:mr-[40px] flex justify-between lg:justify-start">
      <div className={styles.card}>
        <div className={clsx(styles.title)}>Name</div>
        <TextEllipsis value={detail.tokenName} className={clsx(styles.value)} />
      </div>
      <div className={clsx(styles.card, 'ml-[16px]')}>
        <div className={clsx(styles.title)}>{symbolText}</div>
        {renderSymbol}
      </div>
      <div className={clsx(styles.card, 'ml-[16px]')}>
        <div className={clsx(styles.title, 'min-w-[102px] whitespace-nowrap text-right')}>{amountText}</div>
        <div className={clsx(styles.value, 'text-right')}>{amountStr}</div>
      </div>
    </div>
  );
}
