import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import React from 'react';
import uriToHttp from 'utils/format';

export interface IInfoCard {
  logo?: string;
  name: string;
  tag?: string;
  subName?: string;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

function InfoCard(params: IInfoCard) {
  const { logo, name, tag, subName, className, layout = 'horizontal' } = params;
  return (
    <div className={clsx('flex items-center', layout === 'vertical' ? 'flex-col' : 'flex-row', className)}>
      <div className="flex items-center">
        {logo ? (
          <SkeletonImage
            img={uriToHttp(logo)}
            tag={tag}
            className={clsx(
              'w-[72px] md:w-[84px] h-[72px] md:h-[84px]',
              layout === 'vertical' ? 'mb-[16px]' : 'mr-[16px]',
            )}
          />
        ) : null}
      </div>
      <div className={`flex flex-col ${layout === 'vertical' ? 'mt-[16px]' : 'ml-[16px]'}`}>
        {subName && <span className="text-base text-neutralSecondary font-semibold">{subName}</span>}
        <span className="text-xl text-neutralPrimary font-semibold mt-[4px]">{name}</span>
      </div>
    </div>
  );
}

export default React.memo(InfoCard);
