import React from 'react';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { ToolTip } from 'aelf-design';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';

function ColumnsTitle({ title, tooltip, theme = 'light' }: { title: string; tooltip?: string[]; theme?: TModalTheme }) {
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

      <span className={clsx('text-sm font-medium', theme === 'dark' ? 'text-pixelsBorder' : 'text-neutralDisable')}>
        {title}
      </span>
    </div>
  );
}

export default React.memo(ColumnsTitle);
