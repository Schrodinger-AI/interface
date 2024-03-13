import { Skeleton } from 'antd';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useState } from 'react';

interface ISkeletonImage {
  img?: string;
  tag?: string;
  className?: string;
  imageSizeType?: 'cover' | 'contain';
  width?: number;
  height?: number;
}

function SkeletonImage(props: ISkeletonImage) {
  const { img, className, imageSizeType = 'cover', tag, width = 108, height = 108 } = props;

  const [skeletonActive, setSkeletonActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const imageType = {
    cover: 'object-cover',
    contain: 'object-contain',
  };

  const imageUrl = useMemo(() => {
    if (typeof img === 'string') {
      const pattern = /^(http|https):\/\/|\/_next/;
      const patternBase = /^(data):\/\//;

      if (pattern.test(img)) {
        return img;
      }
      if (patternBase.test(img)) {
        return img;
      } else {
        return `data:${img}`;
      }
    } else {
      return img;
    }
  }, [img]);

  return (
    <div className={clsx('relative rounded-lg overflow-hidden', className)}>
      {(loading || !imageUrl) && (
        <Skeleton.Image className="absolute top-0 left-0 !w-full !h-full" active={imageUrl ? skeletonActive : false} />
      )}
      {imageUrl && (
        <div className="w-full h-full relative">
          <img
            width={width}
            height={height}
            src={imageUrl}
            alt="image"
            className={clsx('w-full h-full', imageType[imageSizeType])}
            onLoad={() => {
              setLoading(false);
              setSkeletonActive(false);
            }}
            onError={() => {
              setSkeletonActive(false);
            }}
          />
          {tag && (
            <div className="absolute top-[4px] text-white left-[4px] bg-fillMask1 px-[4px] rounded-sm text-[10px] leading-[16px] font-medium">
              {tag}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(SkeletonImage);
