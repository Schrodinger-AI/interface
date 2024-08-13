import { Flex } from 'antd';
import { ReactComponent as TrophiesSVG } from 'assets/img/telegram/trophies.svg';
import { ReactComponent as RefreshSVG } from 'assets/img/telegram/refresh.svg';
import BalanceItem from '../BalanceItem';
import useBalanceService from 'pageComponents/tg-home/hooks/useBalanceService';
import CommonCopy from 'components/CommonCopy';
import Link from 'next/link';

export default function BalanceModule({ onSgrBalanceChange }: { onSgrBalanceChange?: (value: string) => void }) {
  const { formatAddress, balanceData, fullAddress, refresh } = useBalanceService({
    onSgrBalanceChange,
  });

  return (
    <>
      <Flex justify="space-between" align="center" className="text-neutralWhiteBg text-sm font-normal">
        <Flex align="center" gap={8}>
          <span className="font-medium">Balance:</span>
          <RefreshSVG className="cursor-pointer" onClick={refresh} />
        </Flex>
        <Link href="/tg-weekly-activity-rankings">
          <div className="px-[8px]">
            <TrophiesSVG className="w-[24px] h-[24px]" />
          </div>
        </Link>
      </Flex>
      <Flex gap={16} className="mt-2" wrap="wrap">
        {balanceData.map((item, index) => {
          return <BalanceItem key={index} {...item} onBuy={item.onBuy} />;
        })}
      </Flex>
      <Flex className="text-sm font-medium text-neutralWhiteBg mt-4" align="center">
        <span>Address:</span>
        <CommonCopy toCopy={fullAddress} className="text-pixelsTertiaryTextPurple ml-4" size="large">
          {formatAddress}
        </CommonCopy>
      </Flex>
    </>
  );
}
