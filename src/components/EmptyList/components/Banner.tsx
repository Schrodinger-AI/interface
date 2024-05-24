import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { useResponsive } from 'hooks/useResponsive';
import React from 'react';
import { TEmptyChannelBanner } from 'types/misc';

function Banner({ banner }: { banner: TEmptyChannelBanner }) {
  const { isLG } = useResponsive();
  const { jumpToPage } = useJumpToPage();

  return (
    <div
      className={clsx('flex w-full h-auto first:mt-0 mt-[8px] overflow-hidden', banner?.link ? 'cursor-pointer' : '')}
      onClick={() => jumpToPage({ link: banner?.link, linkType: banner?.linkType })}>
      <SkeletonImage
        img={isLG ? banner.imgUrl.mobile || '' : banner.imgUrl.pc || ''}
        className="w-full h-auto"
        imageClassName="!rounded-none"
      />
    </div>
  );
}

export default React.memo(Banner);
