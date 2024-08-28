import { ReactComponent as RankOneIcon } from 'assets/img/telegram/rank/rank_1.svg';
import { ReactComponent as RankTwoIcon } from 'assets/img/telegram/rank/rank_2.svg';
import { ReactComponent as RankThreeIcon } from 'assets/img/telegram/rank/rank_3.svg';
import clsx from 'clsx';
import CommonCopy from 'components/CommonCopy';
import { TgWeeklyActivityRankTime } from 'pageComponents/tg-weekly-activity-rankings/types/type';
import { ReactNode, useMemo } from 'react';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { formatTokenPrice } from 'utils/format';

const rankStyle: Record<
  string,
  {
    backgroundColor: [string, string];
    icon?: ReactNode;
  }
> = {
  1: {
    backgroundColor: ['bg-[#D99D25]', 'bg-[var(--fill-mask-6)]'],
    icon: <RankOneIcon />,
  },
  2: {
    backgroundColor: ['bg-[#999ABC]', 'bg-[var(--fill-mask-6)]'],
    icon: <RankTwoIcon />,
  },
  3: {
    backgroundColor: ['bg-[#B36439]', 'bg-[var(--fill-mask-6)]'],
    icon: <RankThreeIcon />,
  },
  default: {
    backgroundColor: ['bg-[#040406]', 'bg-[var(--transparent-white-10)]'],
  },
  my: {
    backgroundColor: ['bg-pixelsCardBg', 'bg-[var(--fill-mask-7)]'],
  },
};

export default function RankList({
  index,
  value,
  type,
  isMine = false,
  bottom = false,
}: {
  index: string;
  value: IActivityBotRankDataItem;
  type: TgWeeklyActivityRankTime;
  isMine?: boolean;
  bottom?: boolean;
}) {
  const currentShowValue = useMemo(() => {
    if (type === TgWeeklyActivityRankTime.thisWeek) {
      return value.scores
        ? formatTokenPrice(value.scores, {
            decimalPlaces: 1,
          })
        : '-';
    } else {
      return value.reward ? `${value.reward} SGR` : '-';
    }
  }, [type, value.reward, value.scores]);

  const backgroundColor = useMemo(() => {
    if (rankStyle[`${index}`]) {
      return rankStyle[`${index}`].backgroundColor;
    }
    if (isMine) {
      return rankStyle.my.backgroundColor;
    }
    return rankStyle.default.backgroundColor;
  }, [index, isMine]);

  return (
    <div
      className={clsx(
        'relative w-full h-[54px] rounded-md pr-[3px] pb-[3px]',
        bottom ? 'mb-0' : 'mb-[8px]',
        backgroundColor[0],
      )}>
      {bottom ? null : (
        <div className={clsx('absolute top-0 left-0 w-full h-full z-0 rounded-md', backgroundColor[1])} />
      )}

      <div
        className={clsx(
          'relative z-10 w-full h-full py-[12px] pl-[10px] pr-[7px] rounded-md flex justify-between items-center',
          backgroundColor[0],
        )}>
        <div className="flex items-center">
          <div className={bottom ? 'mr-[8px]' : 'mr-[4px]'}>
            {(rankStyle[`${index}`] && rankStyle[`${index}`].icon) || (
              <div
                className={clsx(
                  'flex items-center justify-center w-[20px] h-[20px] rounded-full text-pixelsWhiteBg text-xs font-semibold',
                  isMine ? 'bg-pixelsDashPurple' : 'bg-pixelsHover',
                )}>
                {index}
              </div>
            )}
          </div>
          <CommonCopy
            toCopy={addPrefixSuffix(value.address)}
            iconStyle="fill-pixelsWhiteBg"
            className="text-pixelsWhiteBg text-xs font-medium">
            {getOmittedStr(addPrefixSuffix(value.address), OmittedType.ADDRESS)}
          </CommonCopy>
        </div>
        <span className="text-pixelsWhiteBg text-sm font-semibold">{currentShowValue}</span>
      </div>
    </div>
  );
}
