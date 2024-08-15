import { ReactComponent as RankOneIcon } from 'assets/img/telegram/rank/rank_1.svg';
import { ReactComponent as RankTwoIcon } from 'assets/img/telegram/rank/rank_2.svg';
import { ReactComponent as RankThreeIcon } from 'assets/img/telegram/rank/rank_3.svg';
import clsx from 'clsx';
import CommonCopy from 'components/CommonCopy';
import { TgWeeklyActivityRankTime } from 'pageComponents/tg-weekly-activity-rankings/types/type';
import { ReactNode, useMemo } from 'react';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { formatTokenPrice } from 'utils/format';

const rankIcon: Record<string, ReactNode> = {
  1: <RankOneIcon />,
  2: <RankTwoIcon />,
  3: <RankThreeIcon />,
};

export default function RankList({
  theme = 'default',
  index,
  value,
  type,
  pointsTitle,
}: {
  theme?: 'blue' | 'default';
  index: string;
  value: IActivityBotRankDataItem;
  type: TgWeeklyActivityRankTime;
  pointsTitle?: string;
}) {
  const currentShowValue = useMemo(() => {
    if (type === TgWeeklyActivityRankTime.thisWeek) {
      return value.scores ? formatTokenPrice(value.scores) : '-';
    } else {
      return value.reward ? `${value.reward} SGR` : '-';
    }
  }, [type, value.reward, value.scores]);

  return (
    <div className="border-0 border-b border-solid border-pixelsBorder py-[16px] flex justify-between items-center">
      <div className="w-[160px]">
        <div className="text-pixelsWhiteBg flex items-center">{rankIcon[`${index}`] || index}</div>
        <CommonCopy toCopy={addPrefixSuffix(value.address)} className="mt-[4px] text-pixelsWhiteBg text-xs font-medium">
          {getOmittedStr(addPrefixSuffix(value.address), OmittedType.ADDRESS)}
        </CommonCopy>
      </div>
      <div className="flex-1 flex flex-col justify-center items-end">
        <span className="text-pixelsWhiteBg text-sm font-semibold">{currentShowValue}</span>
        {pointsTitle ? (
          <span className={clsx('text-xs mt-[4px]', theme === 'blue' ? 'text-pixelsDivider' : 'text-pixelsBorder')}>
            {pointsTitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
