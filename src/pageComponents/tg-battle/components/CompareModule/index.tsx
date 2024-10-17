import React from 'react';

const DynamicBar = ({ data }: { data: number[] }) => {
  const [left = 50, right = 50] = data;
  const total = left + right;
  const leftPercentage = (left / total) * 100;
  const rightPercentage = (right / total) * 100;

  return (
    <div className="mt-[16px]">
      <div className="flex w-full justify-between">
        <div className="text-pixelsWhiteBg text-[16px] font-bold leading-[24px]">{Math.round(leftPercentage)}%</div>
        <div className="text-pixelsWhiteBg text-[16px] font-bold leading-[24px]">{Math.round(rightPercentage)}%</div>
      </div>
      <div className="flex w-full h-[42px] overflow-hidden">
        <div
          style={{ width: `${leftPercentage}%` }}
          className="flex items-center justify-start bg-compareLeftBg shadow-compareLeftShadow text-pixelsWhiteBg font-bold text-[12px] rounded-l-[8px] pl-[10px]">
          {left}
        </div>
        <div
          style={{ width: `${rightPercentage}%` }}
          className="flex items-center justify-end bg-compareRightBg shadow-compareRightShadow text-pixelsWhiteBg font-bold text-[12px] rounded-r-[8px] pr-[10px]">
          {right}
        </div>
      </div>
    </div>
  );
};

export default DynamicBar;
