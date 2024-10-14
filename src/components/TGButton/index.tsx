import clsx from 'clsx';
import { useMemo } from 'react';
import styles from './index.module.css';

type TNoticeBarType = 'warning' | 'success';

interface INoticeBar {
  type?: TNoticeBarType;
  size?: 'large' | 'medium' | 'small';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function TGButton({
  children,
  type = 'warning',
  size = 'medium',
  className,
  style,
  onClick,
}: INoticeBar) {
  const backgroundColor = useMemo(() => {
    switch (type) {
      case 'warning':
        return styles['btn-warning'];
      case 'success':
        return styles['btn-success'];
    }
  }, [type]);

  const btnSize = useMemo(() => {
    switch (size) {
      case 'large':
        return 'h-[46px] px-[35px] py-[10px] border-radius-[8px]';
      case 'small':
        return 'h-[38px] px-[10px] py-[4px] border-radius-[4px]';
      default:
        return 'h-[32px] px-[18px] py-[6px] border-radius-[6px]';
    }
  }, [size]);

  return (
    <button
      className={clsx(
        styles.tgButton,
        'relative border-none flex items-center justify-center cursor-pointer text-white font-medium overflow-hidden',
        backgroundColor,
        btnSize,
        className,
      )}
      style={style}
      onClick={onClick}>
      <span className={clsx(styles.btnText, 'dark-btn-font z-10')}>{children}</span>
    </button>
  );
}
