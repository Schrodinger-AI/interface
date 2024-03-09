import React from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import styles from './index.module.css';
import { ReactComponent as Close } from 'assets/img/clear.svg';
import useResponsive from 'hooks/useResponsive';
export interface ModalProps extends AntdModalProps {
  subTitle?: string;
}
function Modal(props: ModalProps) {
  const { children, className, title, subTitle, wrapClassName } = props;

  const { isLG } = useResponsive();

  return (
    <AntdModal
      keyboard={false}
      maskClosable={false}
      destroyOnClose={true}
      closeIcon={<Close width={24} height={24} />}
      width={800}
      centered
      {...props}
      className={`${styles.modal} ${isLG && styles['modal-mobile']} ${className || ''}`}
      wrapClassName={`${styles['modal-wrap']} ${wrapClassName}`}
      title={
        <div>
          <div className="pr-8 break-words">{title}</div>
          {subTitle && <div className="mt-2">{subTitle}</div>}
        </div>
      }>
      {children}
    </AntdModal>
  );
}

export default React.memo(Modal);
