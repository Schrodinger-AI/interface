import React from 'react';

const DynamicBar = ({ data }: { data: number[] }) => {
  const [leftValue = 0, rightValue = 0] = data;
  let [left = 50, right = 50] = data;
  if (left === 0 && right === 0) {
    left = 50;
    right = 50;
  }
  const total = left + right;
  const leftPercentage = (left / total) * 100;
  const rightPercentage = (right / total) * 100;

  return (
    <div className="mt-[16px]">
      <div className="flex w-full justify-between">
        <div className="text-pixelsWhiteBg text-base font-bold">{Math.round(leftPercentage)}%</div>
        <div className="text-pixelsWhiteBg text-base font-bold">{Math.round(rightPercentage)}%</div>
      </div>
      <div className="flex w-full h-[42px] overflow-hidden">
        <div
          style={{ width: `${leftPercentage}%` }}
          className="flex items-center justify-start bg-compareLeftBg text-pixelsWhiteBg font-bold text-sm rounded-l-[8px] pl-[10px] max-w-[92%] min-w-[8%]">
          {leftValue}
        </div>
        <div
          style={{ width: `${rightPercentage}%` }}
          className="flex items-center justify-end bg-compareRightBg text-pixelsWhiteBg font-bold text-sm rounded-r-[8px] pr-[10px] max-w-[92%] min-w-[8%]">
          {rightValue}
        </div>
      </div>
    </div>
  );
};

export default DynamicBar;
