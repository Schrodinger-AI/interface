import { IInputProps, Input } from 'aelf-design';
import { ReactComponent as SearchIcon } from 'assets/img/search.svg';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import React, { useState } from 'react';
import styles from './index.module.css';

export default function SearchInput(
  props: Omit<IInputProps, 'prefix'> & {
    showTotalAmount?: (value: boolean) => void;
    theme?: TModalTheme;
  },
) {
  const [inputHide, setInputHide] = useState<boolean>(true);

  return (
    <Input
      style={{
        width: inputHide ? '48px' : 'auto',
      }}
      className={clsx(
        inputHide ? 'flex-none border-brandDefault' : 'flex-1',
        'overflow-hidden',
        props.theme === 'dark' &&
          '!bg-pixelsModalBg rounded-none !border-pixelsBorder !tg-card-shadow text-pixelsDivider',
        props.theme === 'dark' && styles['dark-input'],
      )}
      allowClear
      {...props}
      onBlur={() => {
        setInputHide(true);
        props?.showTotalAmount && props.showTotalAmount(true);
      }}
      onFocusCapture={() => {
        setInputHide(false);
        props?.showTotalAmount && props.showTotalAmount(false);
      }}
      prefix={
        <SearchIcon
          className={clsx(
            inputHide ? 'fill-brandDefault ml-[4px]' : 'fill-neutralDisable',
            'w-[20px] h-[20px]',
            props.theme === 'dark' && 'fill-pixelsWhiteBg',
          )}
        />
      }
    />
  );
}
