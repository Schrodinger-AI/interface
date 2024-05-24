import React from 'react';
import { TEmptyChannelIntroductionList } from 'types/misc';
import SkeletonImage from 'components/SkeletonImage';
import { useResponsive } from 'hooks/useResponsive';
import { useJumpToPage } from 'hooks/useJumpToPage';
import clsx from 'clsx';

function IntroductionList({ title, description, image }: TEmptyChannelIntroductionList) {
  const { isLG } = useResponsive();
  const { jumpToPage } = useJumpToPage();

  return (
    <div className="mt-[16px] first:mt-0">
      <p className="text-sm text-neutralPrimary font-medium px-[8px]">{title}</p>
      {description ? (
        <div className="px-[8px]">
          {description.map((item, index) => {
            return (
              <span key={index} className="text-neutralSecondary text-sm">
                {item}
              </span>
            );
          })}
        </div>
      ) : null}
      {image && image.length ? (
        <div className="p-[8px]">
          {image.map((item, index) => {
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
                  className="w-full h-auto"
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
