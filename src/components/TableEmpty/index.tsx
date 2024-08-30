import React, { useMemo } from 'react';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';
import { ReactComponent as ArchivePurpleSVG } from 'assets/img/archive-purple.svg';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';

interface ITableEmpty {
  title?: string;
  theme?: TModalTheme | 'transparent';
  className?: string;
  description?: string;
}

function TableEmpty({ description, title, theme = 'light', className }: ITableEmpty) {
  const wrapBg = useMemo(() => {
    switch (theme) {
      case 'dark':
        return 'bg-pixelsPageBg';
      case 'light':
        return 'bg-white';
      case 'transparent':
        return 'bg-transparent';
      default:
        return 'bg-white';
    }
  }, [theme]);

  const descriptionText = useMemo(() => {
    switch (theme) {
      case 'dark':
        return 'text-pixelsDivider';
      case 'light':
        return 'text-neutralSecondary';
      case 'transparent':
        return 'text-[var(--transparent-white-30)]';
      default:
        return 'text-neutralSecondary';
    }
  }, [theme]);

  const icon = useMemo(() => {
    switch (theme) {
      case 'dark':
        return <ArchivePurpleSVG className="w-[56px] mb-[16px] text-purple-50" />;
      case 'light':
        return <ArchiveSVG className="w-[56px] mb-[16px] text-purple-50" />;
      case 'transparent':
        return <ArchivePurpleSVG className="w-[56px] mb-[16px] text-purple-50" />;
      default:
        return <ArchiveSVG className="w-[56px] mb-[16px] text-purple-50" />;
    }
  }, [theme]);

  return (
    <div className={clsx('flex justify-center items-center flex-col p-[60px]', wrapBg, className)}>
      {icon}

      {title && (
        <span className={clsx('text-base mb-[4px]', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary')}>
          {title}
        </span>
      )}
      {description && <span className={clsx('text-base', descriptionText)}>{description}</span>}
    </div>
  );
}

export default React.memo(TableEmpty);
