/* eslint-disable @next/next/no-img-element */
import { useJumpToPage } from 'hooks/useJumpToPage';
import useResponsive from 'hooks/useResponsive';
import React, { useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';

function WebAds() {
  const cmsInfo = useCmsInfo();
  const { isLG, isXL } = useResponsive();
  const { jumpToPage } = useJumpToPage();

  const currentBackgroundImage = useMemo(() => {
    if (!cmsInfo?.webAds?.backgroundImage) return null;
    if (isLG) {
      return cmsInfo.webAds.backgroundImage.mobile || '';
    } else if (isXL) {
      return cmsInfo.webAds.backgroundImage.mid || cmsInfo.webAds.backgroundImage.pc || '';
    } else {
      return cmsInfo.webAds.backgroundImage.pc || '';
    }
  }, [cmsInfo?.webAds?.backgroundImage, isLG, isXL]);

  const onClick = () => {
    jumpToPage({
      link: cmsInfo?.webAds?.link,
      linkType: cmsInfo?.webAds?.linkType || 'link',
      needLogin: cmsInfo?.webAds?.needLogin,
    });
  };

  if (!cmsInfo?.webAds || !cmsInfo?.webAds.show || !cmsInfo?.webAds.backgroundImage) return null;

  if (currentBackgroundImage) {
    return (
      <div
        className="mb-[16px] px-[16px] lg:px-0 lg:mb-[32px] lg:mt-[16px]"
        // style={{ backgroundImage: `url(${currentBackgroundImage})` }}
        onClick={onClick}>
        <img src={currentBackgroundImage} className="w-full h-auto" alt="" />
      </div>
    );
  }
  return null;
}

export default React.memo(WebAds);
