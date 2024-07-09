import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { Segmented, ConfigProvider, SegmentedProps } from 'antd';
import { themeSegmentedConfig } from './config';
import { SegmentedValue } from 'antd/es/segmented';
import { ListTypeEnum } from 'types';

interface IProps {
  options: SegmentedProps['options'];
  value: SegmentedValue | ListTypeEnum;
  onSegmentedChange?: (value?: SegmentedValue | ListTypeEnum) => void;
  className?: string;
}

function CommonSegmented({ onSegmentedChange, value, className, options }: IProps) {
  return (
    <ConfigProvider theme={themeSegmentedConfig}>
      <div className={clsx(styles['common-segmented'], 'h-[48px] w-full', className)}>
        <Segmented
          block
          onChange={(value) => onSegmentedChange && onSegmentedChange(value)}
          value={value}
          size="large"
          options={options}
        />
      </div>
    </ConfigProvider>
  );
}

export default React.memo(CommonSegmented);
