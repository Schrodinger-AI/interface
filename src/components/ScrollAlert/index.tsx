import { Alert, AlertProps } from 'antd';
import clsx from 'clsx';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import styles from './index.module.css';
import { ReactComponent as NoticeIcon } from 'assets/img/icons/notice.svg';
import Marquee from 'react-fast-marquee';
import useResponsive from 'hooks/useResponsive';
import { TModalTheme } from 'components/CommonModal';

export interface IScrollAlertItem {
  text: string | ReactNode;
  handle?: Function;
}

const customizeAlertStyle: Record<
  string,
  {
    styles?: string;
    icon?: ReactNode;
  }
> = {
  notice: {
    styles: styles['alert-notice'],
    icon: <NoticeIcon />,
  },
};

export type TScrollAlertType = 'info' | 'warning' | 'success' | 'error' | 'notice';

type TProps = Omit<AlertProps, 'type'> & {
  data: IScrollAlertItem[];
  type?: TScrollAlertType;
  theme?: TModalTheme;
};

function ScrollAlert(props: TProps) {
  const { data, type = 'warning', theme = 'light' } = props;
  const { isLG, isMD } = useResponsive();

  const [contentWidth, setContentWidth] = useState<number>(0);

  const antType: AlertProps['type'] = useMemo(() => {
    switch (type) {
      case 'notice':
        return 'warning';
      default:
        return type;
    }
  }, [type]);

  useEffect(() => {
    const width = document.querySelector('.aelfd-alert-content')?.clientWidth;
    setContentWidth(width || 0);
  }, []);

  if (!data?.length) return null;

  return (
    <Alert
      className={clsx(
        styles['scroll-alert'],
        theme === 'dark' && styles['scroll-alert-dark'],
        customizeAlertStyle?.[type] && customizeAlertStyle[type].styles,
      )}
      message={
        <Marquee pauseOnHover={isLG ? false : true} gradient={false} speed={isLG ? 40 : 50}>
          {data.map((item, index) => {
            return (
              <p
                key={index}
                onClick={() => item?.handle && item.handle()}
                className={clsx(
                  'text-sm lg:text-base font-semibold min-w-max mr-[80px] whitespace-nowrap',
                  item.handle ? 'cursor-pointer' : 'cursor-default',
                  theme === 'dark' ? 'text-pixelsPageBg' : 'text-neutralPrimary',
                )}
                style={{
                  width: isMD ? 'max-content' : `${contentWidth}px`,
                }}>
                {item.text}
              </p>
            );
          })}
        </Marquee>
      }
      {...props}
      type={antType}
      icon={props.icon || customizeAlertStyle?.[type].icon}
      showIcon
    />
  );
}

export default React.memo(ScrollAlert);
