import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import SkeletonImage from 'components/SkeletonImage';
import { etransferDomain } from 'constants/url';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { useResponsive } from 'hooks/useResponsive';
import React from 'react';
import { TEmptyChannelBanner } from 'types/misc';
import { AdTracker } from 'utils/ad';

function Banner({ banner, theme = 'light' }: { banner: TEmptyChannelBanner; theme?: TModalTheme }) {
  const { isLG } = useResponsive();
  const { jumpToPage } = useJumpToPage();

  const onBannerClick = () => {
    jumpToPage({ link: banner?.link, linkType: banner?.linkType });
    if (banner?.link?.includes(etransferDomain)) {
      AdTracker.trackEvent('user_click_etransfer_noneSGR');
    }
  };

  return (
    <div
      className={clsx('flex w-full h-auto first:mt-0 mt-[8px] overflow-hidden', banner?.link ? 'cursor-pointer' : '')}
      onClick={onBannerClick}>
      <SkeletonImage
        img={isLG ? banner.imgUrl.mobile || '' : banner.imgUrl.pc || ''}
        className={clsx('w-full h-auto', theme === 'dark' && '!rounded-none')}
        imageClassName="!rounded-none"
      />
    </div>
  );
}

export default React.memo(Banner);
