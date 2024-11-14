import Image from 'next/image';
import selectCardImg from 'assets/img/telegram/breed/select-card.png';
import selectCardCornersImg from 'assets/img/telegram/breed/select-card-corners.png';
import clsx from 'clsx';
import { useMemo } from 'react';
import SkeletonImage from 'components/SkeletonImage';

type TSelectCardSize = 'default' | 'large';

function SelectCard({
  onClick,
  className,
  size = 'default',
  imageUrl = '',
  describe,
}: {
  onClick?: () => void;
  className?: string;
  size?: TSelectCardSize;
  imageUrl?: string;
  describe?: string;
}) {
  const imageSize = useMemo(() => {
    return {
      default: {
        background: 'w-[140px]',
        catImage: 'w-[103px] h-[103px]',
        cornersImage: 'w-[103px]',
      },
      large: {
        background: 'w-[199px]',
        catImage: 'w-[150px] h-[150px]',
        cornersImage: 'w-[150px]',
      },
    }[size];
  }, [size]);

  return (
    <div className={clsx('relative z-20', className)} onClick={onClick}>
      <Image src={selectCardImg} className={clsx('relative z-20', imageSize.background)} alt="" />
      {imageUrl ? (
        <div className={clsx('absolute top-0 bottom-0 right-0 left-0 m-auto z-30', imageSize.catImage)}>
          <SkeletonImage rarity={describe} img={imageUrl} width={150} height={150} />
        </div>
      ) : null}

      <Image
        src={selectCardCornersImg}
        className={clsx('w-[103px] absolute top-0 bottom-0 right-0 left-0 m-auto z-40', imageSize.cornersImage)}
        alt=""
      />
    </div>
  );
}

export default SelectCard;
