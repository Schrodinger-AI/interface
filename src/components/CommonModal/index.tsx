import React from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import styles from './index.module.css';
import { ReactComponent as Close } from 'assets/img/clear.svg';
import useResponsive from 'hooks/useResponsive';
import clsx from 'clsx';

export type TModalTheme = 'dark' | 'light';
export interface ModalProps extends AntdModalProps {
  subTitle?: string;
  width?: number;
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
    hideHeader = false,
    wrapClassName,
    width = 800,
    disableMobileLayout = false,
    theme = 'light',
  } = props;

  const { isLG } = useResponsive();

  return (
    <AntdModal
      keyboard={false}
      maskClosable={false}
      destroyOnClose={true}
      closeIcon={<Close width={24} height={24} />}
      width={width}
      centered
      footer={null}
      {...props}
      className={clsx(
        styles.modal,
        isLG && styles['modal-mobile'],
        isLG && !disableMobileLayout && styles['modal-full-screen'],
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
