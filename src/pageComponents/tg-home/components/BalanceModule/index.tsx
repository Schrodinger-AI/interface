import { Flex } from 'antd';
import { ReactComponent as RefreshSVG } from 'assets/img/telegram/refresh.svg';
import { ReactComponent as LeaderBoardSVG } from 'assets/img/telegram/icon-leaderboard.svg';
import { ReactComponent as InviteSVG } from 'assets/img/telegram/icon-invite.svg';
import BalanceItem from '../BalanceItem';
import useBalanceService from 'pageComponents/tg-home/hooks/useBalanceService';
import CommonCopy from 'components/CommonCopy';
import Link from 'next/link';
import { useCmsInfo, useJoinStatus } from 'redux/hooks';

export default function BalanceModule({
  onSgrBalanceChange,
  onElfBalanceChange,
}: {
  onSgrBalanceChange?: (value: string) => void;
  onElfBalanceChange?: (value: string) => void;
}) {
  const { formatAddress, balanceData, fullAddress, refresh } = useBalanceService({
    onSgrBalanceChange,
    onElfBalanceChange,
  });
  const cmsInfo = useCmsInfo();
  const isJoin = useJoinStatus();

  return (
    <>
      <Flex justify="space-between" align="center" className="w-full text-neutralWhiteBg text-sm font-normal">
        <Flex align="center" gap={8}>
          <span className="font-medium">Balance:</span>
          <RefreshSVG className="cursor-pointer" onClick={refresh} />
        </Flex>
        <div className="flex items-center">
          {cmsInfo?.weeklyActivityRankingsEntrance ? (
            <Link href="/tg-weekly-activity-rankings">
              <div className="px-[8px]">
                <LeaderBoardSVG className="w-[30px] h-[30px]" />
              </div>
            </Link>
          ) : null}
          {isJoin ? (
            <Link href="/tg-referral" className="ml-[16px]">
              <div className="px-[8px]">
                <InviteSVG className="w-[30px] h-[30px]" />
              </div>
            </Link>
          ) : null}
        </div>
      </Flex>
      <Flex gap={16} className="mt-2" wrap="wrap">
        {balanceData.map((item, index) => {
          return <BalanceItem key={index} {...item} onBuy={item.onBuy} />;
        })}
      </Flex>
      <Flex className="w-full text-sm font-medium text-neutralWhiteBg mt-4" align="center">
        <span>Address:</span>
        <CommonCopy toCopy={fullAddress} className="text-pixelsTertiaryTextPurple ml-4" size="large">
          {formatAddress}
        </CommonCopy>
      </Flex>
    </>
  );
}
