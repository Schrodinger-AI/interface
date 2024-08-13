import React, { useMemo } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { ConfigProvider, Tabs, TabsProps } from 'antd';
import { themeDarkTabsConfig, themeLightTabsConfig, themeCommonTabsConfig } from './config';
import { TModalTheme } from 'components/CommonModal';

interface IProps {
  options: TabsProps['items'];
  activeKey: string;
  theme?: TModalTheme;
  onTabsChange?: (value?: string) => void;
  className?: string;
}

function CommonTabs({ onTabsChange, activeKey, theme = 'light', className, options }: IProps) {
  const themeConfig = useMemo(() => {
    const config = theme === 'dark' ? themeDarkTabsConfig : themeLightTabsConfig;
    return {
      ...themeCommonTabsConfig,
      ...config,
    };
  }, [theme]);

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={clsx(styles['common-tabs'], 'h-[48px] w-full', className)}>
        <Tabs
          onChange={(value) => onTabsChange && onTabsChange(value)}
          activeKey={activeKey}
          size="small"
          items={options}
        />
      </div>
    </ConfigProvider>
  );
}

export default React.memo(CommonTabs);
