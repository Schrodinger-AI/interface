import { useCopyToClipboard } from 'react-use';
import React from 'react';
import { ReactComponent as CopyIcon } from 'assets/img/copy.svg';
import { ReactComponent as CopyIconLarge } from 'assets/img/copy-large.svg';
import { message } from 'antd';
import clsx from 'clsx';
export default function CommonCopy({
  toCopy,
  children,
  className,
  size = 'small',
  iconStyle,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  size?: 'small' | 'large';
  iconStyle?: string;
}) {
  const [, setCopied] = useCopyToClipboard();
  return (
    <span className={clsx('flex items-center cursor-pointer', className)}>
      {children}
      <span
        className="ml-2"
        onClick={(e) => {
          e.stopPropagation();
          setCopied(toCopy);
          message.success('Copied');
        }}>
        {size === 'small' ? <CopyIcon className={clsx(iconStyle)} /> : <CopyIconLarge className={clsx(iconStyle)} />}
      </span>
    </span>
  );
}
