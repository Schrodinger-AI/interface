/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import styles from './index.module.css';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as CloseIcon } from 'assets/img/telegram/icons/icon_close.svg';
import clsx from 'clsx';

export type TModalTheme = 'dark' | 'light';
export interface ModalProps extends AntdModalProps {
  subTitle?: string;
  hideHeader?: boolean;
  disableMobileLayout?: boolean;
  theme?: TModalTheme;
}
function CommonModal(props: ModalProps) {
  const {
    children,
    className,
    title,
    subTitle,
    closable = true,
    hideHeader = false,
    wrapClassName,
    maskClosable = true,
    disableMobileLayout = false,
    theme = 'light',
  } = props;

  const { isLG } = useResponsive();

  return (
    <AntdModal
      keyboard={false}
      maskClosable={maskClosable}
      destroyOnClose={true}
      closable={closable}
      closeIcon={<CloseIcon className="w-[24px] h-[24px]" />}
      centered
      footer={null}
      {...props}
      className={clsx(
        styles.modal,
        isLG && styles['modal-mobile'],
        isLG && !disableMobileLayout,
        theme === 'dark' && styles['modal-mobile-dark'],
        hideHeader && styles['modal-hide-header'],
        className,
      )}
      wrapClassName={`${styles['modal-wrap']} ${wrapClassName}`}
      title={
        <div>
          <div className={(clsx('pr-8 break-words'), styles['modal-title'])}>{title}</div>
          {subTitle && <div className="mt-2">{subTitle}</div>}
        </div>
      }>
      {children}
    </AntdModal>
  );
}

export default React.memo(CommonModal);
