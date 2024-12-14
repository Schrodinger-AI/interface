import { ReactComponent as ExclamationCircleSVG } from 'assets/img/exclamationCircle.svg';
import { ReactComponent as PixelsExclamationCircleSVG } from 'assets/img/pixelsIcon/exclamationCircle.svg';
import { ReactComponent as SuccessSVG } from 'assets/img/icons/success.svg';

import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import { useMemo } from 'react';

type TNoticeBarType = 'warning' | 'success' | 'custom';

interface INoticeBar {
  text: string;
  type?: TNoticeBarType;
  theme?: TModalTheme;
  icon?: React.ReactNode;
  className?: string;
}

export default function NoticeBar({ text, theme = 'light', type = 'warning', icon, className }: INoticeBar) {
  const renderIcon = (type: TNoticeBarType, theme: TModalTheme) => {
    switch (type) {
      case 'warning':
        return theme === 'dark' ? (
          <PixelsExclamationCircleSVG className="w-[28px] h-[28px] flex-none" />
        ) : (
          <ExclamationCircleSVG className="w-[28px] h-[28px] flex-none" />
        );
      case 'success':
        return <SuccessSVG className="w-[28px] h-[28px] flex-none" />;
      case 'custom':
        return icon;
    }
  };

  const backgroundColor = useMemo(() => {
    switch (type) {
      case 'warning':
        if (theme === 'dark') {
          return 'bg-pixelsPageBg';
        }
        return 'bg-functionalWarningBg';
      case 'success':
      case 'custom':
        if (theme === 'dark') {
          return 'bg-pixelsPageBg';
        }
        return 'bg-brandBg';
    }
  }, [theme, type]);

  const fontStyle = useMemo(() => {
    switch (type) {
      case 'warning':
        if (theme === 'dark') {
          return 'text-sm text-pixelsDivider';
        }
        return 'text-sm text-neutralSecondary';
      case 'success':
      case 'custom':
        if (theme === 'dark') {
          return 'text-sm text-white';
        }
        return 'text-base font-semibold text-neutralTitle';
    }
  }, [theme, type]);

  return (
    <div className={clsx('px-[12px] py-[7px] flex items-center gap-[8px] rounded-[8px]', backgroundColor, className)}>
      {renderIcon(type, theme)}
      <span className={fontStyle}>{text}</span>
    </div>
  );
}
