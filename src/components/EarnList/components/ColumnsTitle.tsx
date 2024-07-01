import React from 'react';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { ToolTip } from 'aelf-design';

function ColumnsTitle({ title, tooltip }: { title: string; tooltip?: string[] }) {
  return (
    <div className="flex items-center">
      {tooltip && tooltip.length ? (
        <ToolTip
          title={
            <div>
              {tooltip.map((item, index) => {
                return <p key={index}>{item}</p>;
              })}
            </div>
          }
          className="mr-[4px]">
          <Question className="fill-neutralDisable" />
        </ToolTip>
      ) : null}

      <span className="text-sm text-neutralDisable font-medium">{title}</span>
    </div>
  );
}

export default React.memo(ColumnsTitle);
