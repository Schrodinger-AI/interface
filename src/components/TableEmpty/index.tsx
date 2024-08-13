import React from 'react';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';
import { ReactComponent as ArchivePurpleSVG } from 'assets/img/archive-purple.svg';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';

interface ITableEmpty {
  title?: string;
  theme?: TModalTheme;
  description?: string;
}

function TableEmpty({ description, title, theme = 'light' }: ITableEmpty) {
  return (
    <div
      className={clsx(
        'flex justify-center items-center flex-col p-[60px]',
        theme === 'dark' ? 'bg-pixelsPageBg' : 'bg-white',
      )}>
      {theme === 'dark' ? (
        <ArchivePurpleSVG className="w-[56px] mb-[16px] text-purple-50" />
      ) : (
        <ArchiveSVG className="w-[56px] mb-[16px] text-purple-50" />
      )}

      {title && (
        <span className={clsx('text-base mb-[4px]', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary')}>
          {title}
        </span>
      )}
      {description && (
        <span className={clsx('text-base', theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
          {description}
        </span>
      )}
    </div>
  );
}

export default React.memo(TableEmpty);
