import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import React from 'react';

export interface IInfoCard {
  logo?: string;
  name: string;
  subName?: string;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

function InfoCard(params: IInfoCard) {
  const { logo, name, subName, className, layout = 'horizontal' } = params;
  return (
    <div className={clsx('flex items-center', layout === 'vertical' ? 'flex-col' : 'flex-row', className)}>
      <div>
        {logo ? (
          <SkeletonImage
            img={logo}
            className={clsx(
              'w-[72px] md:w-[84px] h-[72px] md:h-[84px]',
              layout === 'vertical' ? 'mb-[16px]' : 'mr-[16px]',
            )}
          />
        ) : null}
        <div className="flex flex-col">
          {subName && <span className="text-base text-neutralSecondary font-semibold">{subName}</span>}
          <span className="text-xl text-neutralPrimary font-semibold">{name}</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(InfoCard);
