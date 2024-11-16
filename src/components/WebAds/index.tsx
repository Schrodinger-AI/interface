/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { useJumpToPage } from 'hooks/useJumpToPage';
import useResponsive from 'hooks/useResponsive';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';

function WebAds() {
  const cmsInfo = useCmsInfo();
  const router = useRouter();
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
        className="mx-[16px] mb-[16px] h-[34vw] rounded-[8px] overflow-hidden bg-center bg-no-repeat bg-cover block"
        style={{ backgroundImage: `url(${currentBackgroundImage})` }}
        onClick={onClick}></div>
    );
  }
  return null;
}

export default React.memo(WebAds);
