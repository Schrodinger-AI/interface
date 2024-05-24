import React from 'react';
import { TEmptyChannelIntroductionStep } from 'types/misc';
import SkeletonImage from 'components/SkeletonImage';

function StepCard({ title, description, card }: TEmptyChannelIntroductionStep) {
  return (
    <div>
      <p className="text-sm text-neutralPrimary font-medium">{title}</p>
      {description ? (
        <div className="h-auto lg:h-[40px]">
          {description.map((item, index) => {
            return (
              <span key={index} className="text-neutralSecondary text-xs">
                {item}
              </span>
            );
          })}
        </div>
      ) : null}
      {card && card.image ? (
        <div className="mt-[8px] shadow-cardShadow p-[12px] rounded-lg">
          <SkeletonImage
            img={card.image}
            className="w-full lg:max-h-[120px] !rounded-none"
            imageClassName="!rounded-none"
          />
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(StepCard);
