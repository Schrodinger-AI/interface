import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import SkeletonImage from 'components/SkeletonImage';
import { useMemo } from 'react';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';

function Rank({ rankList, theme = 'light' }: { rankList: ICatPoolRankRes['rankList']; theme?: TModalTheme }) {
  const isDark = useMemo(() => theme === 'dark', [theme]);
  return (
    <div className="px-[16px] mt-[9px]">
      <p
        className={clsx(
          'text-base font-black',
          isDark
            ? 'text-pixelsWhiteBg'
            : 'text-neutralDisable py-[13px] border-0 border-b border-solid border-neutralDivider',
        )}>
        Rank
      </p>
      <div className={clsx(isDark ? 'mt-[8px]' : '')}>
        {rankList.map((item, index) => {
          return (
            <div
              key={index}
              className={clsx(
                'flex justify-between items-center p-[8px] mb-[6px]',
                isDark ? 'border border-solid border-pixelsBorder' : '',
              )}>
              <div className="flex items-center">
                <span
                  className={clsx(
                    'text-sm mr-[16px] font-medium',
                    isDark ? 'text-pixelsDivider' : 'text-neutralTitle',
                  )}>
                  {index + 1}
                </span>
                <span className={clsx('text-sm font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                  {getOmittedStr(addPrefixSuffix(item.address), OmittedType.ADDRESS)}
                </span>
              </div>
              <div className="w-[36px] h-[36px] border border-solid border-pixelsWhiteBg rounded-[2px]">
                <SkeletonImage img={item.image} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Rank;
