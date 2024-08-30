import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { Segmented, ConfigProvider, SegmentedProps } from 'antd';
import { themeDarkSegmentedConfig, themeSegmentedConfig } from './config';
import { SegmentedValue } from 'antd/es/segmented';
import { ListTypeEnum } from 'types';
import { TModalTheme } from 'components/CommonModal';
import { useResponsive } from 'hooks/useResponsive';
import { SizeType } from 'antd/es/config-provider/SizeContext';

interface IProps {
  options: SegmentedProps['options'];
  value: SegmentedValue | ListTypeEnum;
  theme?: TModalTheme;
  onSegmentedChange?: (value?: SegmentedValue | ListTypeEnum) => void;
  className?: string;
  segmentedSize?: SizeType;
}

function CommonSegmented({ onSegmentedChange, value, className, options, theme, segmentedSize = 'large' }: IProps) {
  const { isLG } = useResponsive();
  return (
    <ConfigProvider theme={theme === 'dark' ? themeDarkSegmentedConfig : themeSegmentedConfig}>
      <div
        className={clsx(
          styles['common-segmented'],
          isLG && styles['common-segmented-mobile'],
          theme === 'dark' && styles['common-segmented-dark'],
          'h-[48px] w-full',
          className,
        )}>
        <Segmented
          block
          onChange={(value) => onSegmentedChange && onSegmentedChange(value)}
          value={value}
          size={segmentedSize}
          options={options}
        />
      </div>
    </ConfigProvider>
  );
}

export default React.memo(CommonSegmented);
