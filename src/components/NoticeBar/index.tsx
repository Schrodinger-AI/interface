import { ReactComponent as ExclamationCircleSVG } from 'assets/img/exclamationCircle.svg';
import { ReactComponent as PixelsExclamationCircleSVG } from 'assets/img/pixelsIcon/exclamationCircle.svg';
import { ReactComponent as SuccessSVG } from 'assets/img/icons/success.svg';

import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import { useMemo } from 'react';

type TNoticeBarType = 'warning' | 'success';

interface INoticeBar {
  text: string;
  type?: TNoticeBarType;
  theme?: TModalTheme;
}

export default function NoticeBar({ text, theme = 'light', type = 'warning' }: INoticeBar) {
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
        return 'text-base font-semibold text-neutralTitle';
    }
  }, [theme, type]);

  return (
    <div
      className={clsx(
        'px-[12px] py-[16px] flex items-center gap-[8px]',
        backgroundColor,
        theme === 'dark' ? 'rounded-none' : 'rounded-md',
      )}>
      {renderIcon(type, theme)}
      <span className={fontStyle}>{text}</span>
    </div>
  );
}
