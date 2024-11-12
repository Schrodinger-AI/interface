import winnerBg from 'assets/img/telegram/breed/winner-cloud-bg.png';
import noWinnerBg from 'assets/img/telegram/breed/no-winner-cloud-bg.png';
import winnerInfoBg from 'assets/img/telegram/breed/winner-info-bg.png';
import Image from 'next/image';
import KittenOnTheGrass from '../KittenOnTheGrass';
import SelectCard from '../SelectCard';
import clsx from 'clsx';
import { useMemo } from 'react';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';

function RewardResult({ winnerInfo }: { winnerInfo?: IWinnerInfo }) {
  const hasWinner = useMemo(() => (winnerInfo?.winnerAddress ? true : false), [winnerInfo?.winnerAddress]);

  return (
    <div className="relative z-20 w-full -mt-[70px] overflow-hidden pt-[50px]">
      <Image src={hasWinner ? winnerBg : noWinnerBg} className="relative z-10 w-full" alt={''} />
      <div className="absolute z-20 top-0 left-0 w-full h-full pt-[70px]">
        <div className="w-full h-full flex flex-col justify-center items-center">
          {hasWinner ? (
            <span className="relative z-20 text-base text-pixelsWhiteBg font-black mb-[18px]">Winner</span>
          ) : null}

          <SelectCard size="large" imageUrl={winnerInfo?.winnerImage} />
          <div className={clsx('relative z-10 mt-[12px]')}>
            <Image src={winnerInfoBg} className="w-[270px]" alt={''} />
            <span className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-sm font-black text-pixelsWhiteBg pb-[7px]">
              {winnerInfo?.winnerAddress
                ? getOmittedStr(addPrefixSuffix(winnerInfo?.winnerAddress), OmittedType.ADDRESS)
                : 'No Winner This Round'}
            </span>
          </div>

          <span className="flex text-center w-[176px] text-pixelsWhiteBg text-xs font-semibold mt-[11px]">
            80% of the Bonus Prize Pool rolls over to the next round
          </span>
        </div>
      </div>
      <KittenOnTheGrass isEnd={true} hasWinner={hasWinner} className="fixed bottom-0 left-0 z-30" />
    </div>
  );
}

export default RewardResult;
