import React, { ReactElement } from 'react';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { ToolTip } from 'aelf-design';

function TableCell({ value, tooltip }: { value: string | ReactElement; tooltip?: string[] }) {
  return (
    <div className="inline-block text-sm text-neutralPrimary font-medium">
      {typeof value === 'string' ? <span className="text-sm text-neutralPrimary font-medium">{value}</span> : value}
      {tooltip && tooltip.length ? (
        <ToolTip
          title={
            <div>
              {tooltip.map((item, index) => {
                return <p key={index}>{item}</p>;
              })}
            </div>
          }
          className="ml-[4px] inline-block">
          <Question className="fill-neutralDisable" />
        </ToolTip>
      ) : null}
    </div>
  );
}

export default React.memo(TableCell);
