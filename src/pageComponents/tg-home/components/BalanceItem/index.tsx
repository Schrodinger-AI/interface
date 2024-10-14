import { Flex } from 'antd';
import { useMemo } from 'react';
import { formatNumber } from 'utils/format';
import { ReactComponent as GoldSVG } from 'assets/img/telegram/icon_gold.svg';
import { ReactComponent as AddGoldSVG } from 'assets/img/telegram/Add_gold.svg';
import { ReactComponent as SilverSVG } from 'assets/img/telegram/icon_silver.svg';
import { ReactComponent as AddSilverSVG } from 'assets/img/telegram/Add_silver.svg';

export interface IBalanceItemProps {
  symbol: string;
  amount: string | number;
  onBuy: () => void;
}

export default function BalanceItem({ symbol, amount, onBuy }: IBalanceItemProps) {
  const amountText = useMemo(() => {
    return `${formatNumber(amount, { minFormat: 1000, decimalPlaces: 2 })}`;
  }, [amount]);

  return (
    <Flex className="h-8">
      <Flex gap={8} align="center" className="cursor-pointer w-fit text-neutralWhiteBg">
        <Flex
          gap={2}
          justify="center"
          align="center"
          className="bg-fillMask1 h-[20px] pl-[2px] pr-[15px] rounded-[4px]"
          onClick={onBuy}>
          {symbol === 'SGR' ? <AddGoldSVG /> : <AddSilverSVG />}
          {amountText}
        </Flex>
        <div className="ml-[-15px]">{symbol === 'SGR' ? <GoldSVG /> : <SilverSVG />}</div>
      </Flex>
    </Flex>
  );
}
