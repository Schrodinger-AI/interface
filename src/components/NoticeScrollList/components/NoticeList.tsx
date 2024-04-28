import SkeletonImage from 'components/SkeletonImage';
import React, { useCallback } from 'react';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
import { useCmsInfo } from 'redux/hooks';
import { openExternalLink } from 'utils/openlink';

interface IProps {
  data: {
    img: any;
    name: string;
    symbol: string;
  };
}

// TODO: mock data

function NoticeList({ data }: IProps) {
  const { img, name } = data;
  const cmsInfo = useCmsInfo();

  const jumpToForest = useCallback(() => {
    const forestUrl = cmsInfo?.forestUrl || '';
    if (!forestUrl) return;
    openExternalLink(`${forestUrl}/detail/buy/${cmsInfo?.curChain}-${data.symbol}/${cmsInfo?.curChain}`, '_blank');
  }, [cmsInfo?.curChain, cmsInfo?.forestUrl, data.symbol]);

  return (
    <div
      className="w-full flex py-[16px] px-0 lg:px-[24px] lg:py-[24px] items-center cursor-pointer hover:bg-neutralHoverBg"
      onClick={jumpToForest}>
      <div className="w-[96px] h-[96px] mr-[16px]">
        <SkeletonImage
          badge={{
            visible: true,
          }}
          img={img}
          imageSizeType="contain"
          className="w-full h-auto aspect-square object-contain"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="w-full truncate text-base text-neutralTitle font-medium">{name}</div>
        <div className="flex items-center">
          <span className="h-[24px] px-[12px] flex justify-center items-center bg-neutralDefaultBg rounded-full text-xs font-medium text-neutralPrimary mt-[4px]">
            BOUGHT
          </span>
          <span className="text-xs text-neutralSecondary ml-[8px]">UTC 2024/02/21 13:45:28</span>
        </div>
        <div className="flex items-center mt-[9px] justify-between">
          <div className="flex items-center">
            <XIcon className="fill-neutralDisable mr-[4px]" />
            <div className="text-xs text-neutralPrimary">21,000,000</div>
          </div>
          <div className="text-sm font-medium text-functionalError lg:text-functionalSuccess">- 8 ELF</div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(NoticeList);
