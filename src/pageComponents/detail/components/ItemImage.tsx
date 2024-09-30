import { TSGRToken } from 'types/tokens';
import SkeletonImage from 'components/SkeletonImage';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';

export default function ItemImage({
  detail: { generation, inscriptionImageUri },
  level,
  rarity,
  rank,
  specialTrait,
  theme = 'light',
}: {
  detail: TSGRToken;
  level?: string;
  rarity?: string;
  rank?: number;
  specialTrait?: string;
  theme?: TModalTheme;
}) {
  return (
    <div
      className={clsx(
        'relative aspect-square w-full lg:mr-[40px] mr-0 lg:w-[450px] flex items-center justify-center mt-[16px] lg:mt-[0px]	border-solid border',
        theme === 'dark'
          ? 'border-pixelsPageBg rounded-none bg-pixelsPageBg'
          : 'border-neutralBorder rounded-lg bg-[#F5FEF7CC]',
      )}>
      <SkeletonImage
        img={inscriptionImageUri}
        generation={generation}
        level={level}
        rarity={rarity}
        tagPosition="large"
        specialTrait={specialTrait}
        rank={rank}
        imageClassName={theme === 'dark' ? 'rounded-none' : 'rounded-lg'}
        className={clsx('w-full', theme === 'dark' ? 'rounded-none' : 'rounded-lg')}
      />
    </div>
  );
}
