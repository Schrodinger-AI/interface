/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { useJumpToPage } from 'hooks/useJumpToPage';
import useResponsive from 'hooks/useResponsive';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';

const bannerInfo: Record<string, string> = {
  '/': 'allCats',
  '/rare-cats': 'rareCats',
  '/my-cats': 'myCats',
};

const buttonStyle = {
  default: 'border-neutralWhiteBg text-neutralWhiteBg bg-[var(--bg-white-8)] text-neutralWhiteBg',
  primary: 'border-neutralWhiteBg bg-neutralWhiteBg text-brandDefault',
};

function TopBanner() {
  const cmsInfo = useCmsInfo();
  const pathname = usePathname();
  const { isLG, isXL } = useResponsive();
  const { jumpToPage } = useJumpToPage();

  const currentConfig = useMemo(() => {
    const bannerInfoKey = bannerInfo?.[pathname];
    if (!bannerInfoKey) return undefined;
    if (cmsInfo?.bannerConfig?.[bannerInfoKey].show) {
      return cmsInfo?.bannerConfig?.[bannerInfoKey];
    }
    return undefined;
  }, [cmsInfo?.bannerConfig, pathname]);

  const backgroundImage = useMemo(() => {
    if (!currentConfig?.backgroundImage) return null;
    if (isLG) {
      return currentConfig.backgroundImage?.mobile;
    } else if (isXL) {
      return currentConfig.backgroundImage?.mid || currentConfig.backgroundImage?.pc;
    } else {
      return currentConfig.backgroundImage.pc;
    }
  }, [currentConfig?.backgroundImage, isLG, isXL]);

  if (!cmsInfo?.bannerConfig || !currentConfig?.show || !backgroundImage) return null;
  return (
    <div className="relative w-full">
      <img src={backgroundImage} alt="banner" className="w-full h-auto" />
      {currentConfig?.button?.length ? (
        <div className="absolute bottom-[16px] lg:bottom-0 left-0 w-full h-auto lg:h-full z-10 flex justify-center lg:justify-end items-center px-[16px] lg:px-[40px]">
          {currentConfig.button.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  if (item.linkType === 'buyModal') return;
                  jumpToPage({
                    link: item.link,
                    linkType: item.linkType,
                  });
                }}
                className={clsx(
                  'flex-1 lg:flex-none mr-[16px] lg:mr-[12] last:mr-0',
                  'lg:min-w-[220px] max-w-[70%] lg:max-w-none px-[12px] h-[32px] lg:h-[48px] rounded-md lg:rounded-lg flex justify-center items-center text-xs lg:text-base font-medium border border-solid border-neutralWhiteBg',
                  buttonStyle[item.buttonType || 'default'],
                  item.link && 'cursor-pointer',
                )}>
                {item.text}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(TopBanner);
