import { Button } from 'aelf-design';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import useTelegram from 'hooks/useTelegram';
import React, { ReactNode, useMemo } from 'react';

interface IProps {
  onClick?: <T>(params?: T) => void;
  theme?: TModalTheme;
  className?: string;
  children?: ReactNode;
}

export const HandleButtonDefault = ({ onClick, theme, className, children }: IProps) => {
  const { isInTG } = useTelegram();
  const isDark = useMemo(() => (theme && theme === 'dark') || isInTG, [isInTG, theme]);

  return (
    <Button
      type="default"
      className={clsx(
        'w-[100px] relative',
        isDark ? 'flex-1 !default-button-dark !rounded-none' : '!rounded-lg !border-brandDefault !text-brandDefault',
        className,
      )}
      size="large"
      onClick={onClick}>
      {children}
    </Button>
  );
};

export const HandleButtonPrimary = ({ onClick, theme, className, children }: IProps) => {
  const { isInTG } = useTelegram();
  const isDark = useMemo(() => (theme && theme === 'dark') || isInTG, [isInTG, theme]);

  return (
    <Button
      type="primary"
      className={clsx('w-[100px] relative', isDark ? '!primary-button-dark !rounded-none' : '!rounded-lg', className)}
      size="large"
      onClick={onClick}>
      {children}
    </Button>
  );
};
