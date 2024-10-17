import clsx from 'clsx';
import { useMemo } from 'react';
import styles from './index.module.css';

type TNoticeBarType = 'warning' | 'success' | 'danger';

interface INoticeBar {
  type?: TNoticeBarType;
  size?: 'large' | 'medium' | 'small';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function TGButton({ children, type, size = 'medium', className, style, onClick }: INoticeBar) {
  const backgroundColor = useMemo(() => {
    switch (type) {
      case 'warning':
        return styles['btn-warning'];
      case 'success':
        return styles['btn-success'];
      case 'danger':
        return styles['btn-danger'];
      default:
        return styles['btn-default'];
    }
  }, [type]);

  const btnSize = useMemo(() => {
    switch (size) {
      case 'large':
        return 'rounded-[8px] text-[16px] !font-black';
      case 'small':
        return 'rounded-[4px] text-[12px] !font-black';
      default:
        return 'rounded-[6px] text-[14px] !font-black';
    }
  }, [size]);

  const btnContentSize = useMemo(() => {
    switch (size) {
      case 'large':
        return 'h-[48px] px-[28px] leading-[46px]';
      case 'small':
        return 'h-[32px] px-[10px] leading-[30px]';
      default:
        return 'h-[40px] px-[18px] leading-[38px]';
    }
  }, [size]);

  return (
    <button
      className={clsx(
        styles.tgButton,
        'relative !p-0 border-[.5px] border-black cursor-pointer text-white overflow-hidden shadow-btnShadow',
        btnSize,
        className,
      )}
      style={style}
      onClick={onClick}>
      <span className={clsx(styles.btnText, backgroundColor, styles[size], btnContentSize, 'block dark-btn-font z-10')}>
        {children}
      </span>
    </button>
  );
}
