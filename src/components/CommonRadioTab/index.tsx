import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { Radio } from 'aelf-design';

export interface ICommonRadioTabButton<T> {
  value: T;
  label: string;
}

interface IProps<T> {
  buttons: ICommonRadioTabButton<T>[];
  value: T;
  onRadioChange?: (value?: T) => void;
  className?: string;
}

function CommonRadioTab({ onRadioChange, value, buttons, className }: IProps<any>) {
  return (
    <div className={clsx(styles['common-radio-tab'], 'h-[48px] w-full', className)}>
      <Radio.Group
        onChange={(e) => onRadioChange && onRadioChange(e.target.value)}
        value={value}
        size="large"
        buttonStyle="solid">
        {buttons.map((item) => {
          return (
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    </div>
  );
}

export default React.memo(CommonRadioTab);
