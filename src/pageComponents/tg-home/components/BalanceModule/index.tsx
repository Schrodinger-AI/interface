import { Flex } from 'antd';
import { ReactComponent as HeadSVG } from 'assets/img/telegram/head.svg';
import { ReactComponent as LeaderBoardSVG } from 'assets/img/telegram/icon-leaderboard.svg';
import { ReactComponent as WalletSVG } from 'assets/img/telegram/icon-wallet.svg';
import BalanceItem, { IBalanceItemProps } from '../BalanceItem';
import Link from 'next/link';
import { useCmsInfo } from 'redux/hooks';
import { useWebLogin } from 'aelf-web-login';
import CommonCopy from 'components/CommonCopy';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';

export default function BalanceModule({ balanceData }: { balanceData: Array<IBalanceItemProps> }) {
  const { wallet } = useWebLogin();
  const cmsInfo = useCmsInfo();
  const balance = balanceData.slice(0, 2);

  return (
    <>
      <Flex justify="space-between" align="center" className="w-full text-neutralWhiteBg text-sm font-normal">
        <Flex align="center" gap={8}>
          <HeadSVG className="cursor-pointer" />
          <CommonCopy toCopy={addPrefixSuffix(wallet?.address)}>
            <span className="text-xs font-medium text-neutralWhiteBg">
              {getOmittedStr(addPrefixSuffix(wallet?.address), OmittedType.ADDRESS)}
            </span>
          </CommonCopy>
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
        </div>
      </Flex>
      <Flex gap={16} justify="space-between" className="mt-2" wrap="wrap">
        {balance.map((item, index) => {
          return <BalanceItem key={index} {...item} onBuy={item.onBuy} />;
        })}
      </Flex>
    </>
  );
}
