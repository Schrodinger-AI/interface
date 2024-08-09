import React, { useMemo } from 'react';
import { TEmptyChannelIntroductionList } from 'types/misc';
import SkeletonImage from 'components/SkeletonImage';
import { useResponsive } from 'hooks/useResponsive';
import { useJumpToPage } from 'hooks/useJumpToPage';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';

function IntroductionList({
  title,
  description,
  image,
  imageDark,
  theme = 'light',
}: TEmptyChannelIntroductionList & {
  theme?: TModalTheme;
}) {
  const { isLG } = useResponsive();
  const { jumpToPage } = useJumpToPage();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const curImages = useMemo(() => {
    if (isDark) {
      return imageDark || image;
    } else {
      return image;
    }
  }, [image, imageDark, isDark]);

  return (
    <div className="mt-[16px] first:mt-0">
      <p className={clsx('text-sm font-medium px-[8px]', isDark ? 'text-pixelsBorder' : 'text-neutralPrimary')}>
        {title}
      </p>
      {description ? (
        <div className="px-[8px]">
          {description.map((item, index) => {
            return (
              <span key={index} className={clsx('text-sm', isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
                {item}
              </span>
            );
          })}
        </div>
      ) : null}
      {curImages && curImages.length ? (
        <div className="p-[8px]">
          {curImages.map((item, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  'mt-[8px] first:mt-0 shadow-cardShadow p-[12px] rounded-lg',
                  item?.link ? 'cursor-pointer' : '',
                )}
                onClick={() => jumpToPage({ link: item?.link, linkType: item?.linkType })}>
                <SkeletonImage
                  img={isLG ? item.mobile || '' : item.pc || ''}
                  className={clsx('w-full h-auto', isDark && '!rounded-none')}
                  imageClassName="!rounded-none"
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(IntroductionList);
