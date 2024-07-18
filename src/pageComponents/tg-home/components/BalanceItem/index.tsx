import { Flex } from 'antd';
import { useMemo } from 'react';
import { formatNumber } from 'utils/format';

export interface IBalanceItemProps {
  symbol: string;
  amount: string | number;
  onBuy: () => void;
}

export default function BalanceItem({ symbol, amount, onBuy }: IBalanceItemProps) {
  const amountText = useMemo(() => {
    return `${formatNumber(amount)} ${symbol}`;
  }, [amount, symbol]);

  const buyText = useMemo(() => {
    return `Buy ${symbol}`;
  }, [symbol]);

  return (
    <Flex className="h-8">
      <Flex
        align="center"
        className="w-[100px] px-2 text-sm text-pixelsWhiteBg font-semibold border-[1px] border-solid border-pixelsBorder bg-pixelsPageBg tg-card-shadow">
        {amountText}
      </Flex>
      <Flex
        justify="center"
        align="center"
        className="w-[71px] text-xs text-neutralWhiteBg font-medium border-[1px] border-dashed border-pixelsDashPurple active:bg-pixelsCardBg bg-pixelsPageBg tg-card-shadow"
        onClick={onBuy}>
        {buyText}
      </Flex>
    </Flex>
  );
}
