import React, { ReactElement } from 'react';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { ToolTip } from 'aelf-design';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';

function TableCell({
  value,
  tooltip,
  theme = 'light',
}: {
  value: string | ReactElement;
  tooltip?: string[];
  theme?: TModalTheme;
}) {
  return (
    <div
      className={clsx(
        'inline-block text-sm font-medium',
        theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary',
      )}>
      {typeof value === 'string' ? (
        <span className={clsx('text-sm font-medium', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary')}>
          {value}
        </span>
      ) : (
        value
      )}
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
