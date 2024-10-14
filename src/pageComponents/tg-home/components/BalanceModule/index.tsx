import { Flex } from 'antd';
import { ReactComponent as HeadSVG } from 'assets/img/telegram/head.svg';
import { ReactComponent as LeaderBoardSVG } from 'assets/img/telegram/icon-leaderboard.svg';
import { ReactComponent as InviteSVG } from 'assets/img/telegram/icon-invite.svg';
import { ReactComponent as WalletSVG } from 'assets/img/telegram/icon-wallet.svg';
import BalanceItem from '../BalanceItem';
import useBalanceService from 'pageComponents/tg-home/hooks/useBalanceService';
import Link from 'next/link';
import { useCmsInfo, useJoinStatus } from 'redux/hooks';
import { useWebLogin } from 'aelf-web-login';

export default function BalanceModule({
  onSgrBalanceChange,
  onElfBalanceChange,
  onPointsChange,
}: {
  onSgrBalanceChange?: (value: string) => void;
  onElfBalanceChange?: (value: string) => void;
  onPointsChange?: (value: number) => void;
}) {
  const { wallet } = useWebLogin();
  const { balanceData, refresh } = useBalanceService({
    onSgrBalanceChange,
    onElfBalanceChange,
    onPointsChange,
  });
  const cmsInfo = useCmsInfo();
  const isJoin = useJoinStatus();
  const balance = balanceData.slice(0, 2);

  return (
    <>
      <Flex justify="space-between" align="center" className="w-full text-neutralWhiteBg text-sm font-normal">
        <Flex align="center" gap={8}>
          <HeadSVG className="cursor-pointer" />
          <p className="font-medium max-w-[40vw] overflow-hidden whitespace-nowrap text-ellipsis">
            {wallet?.address || ''}
          </p>
        </Flex>
        <div className="flex items-center gap-[12px]">
          <Link href="/assets">
            <div className="px-[8px]">
              <WalletSVG className="w-[30px] h-[30px]" />
            </div>
          </Link>

          {cmsInfo?.weeklyActivityRankingsEntrance ? (
            <Link href="/tg-weekly-activity-rankings">
              <div className="px-[8px]">
                <LeaderBoardSVG className="w-[30px] h-[30px]" />
              </div>
            </Link>
          ) : null}
          {!isJoin ? (
            <Link href="/tg-referral">
              <div className="px-[8px]">
                <InviteSVG className="w-[30px] h-[30px]" />
              </div>
            </Link>
          ) : null}
        </div>
      </Flex>
      <Flex gap={16} justify="space-between" className="mt-2" wrap="wrap">
        {balance.map((item, index) => {
          return <BalanceItem key={index} {...item} onBuy={item.onBuy} />;
        })}
      </Flex>
      {/* <Flex className="w-full text-sm font-medium text-neutralWhiteBg mt-4" align="center">
        <span>Address:</span>
        <CommonCopy toCopy={fullAddress} className="text-pixelsTertiaryTextPurple ml-4" size="large">
          {formatAddress}
        </CommonCopy>
      </Flex> */}
    </>
  );
}
