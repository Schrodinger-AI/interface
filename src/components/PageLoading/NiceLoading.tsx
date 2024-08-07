import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { Modal } from 'antd';
import styles from './style.module.css';
import { useMount } from 'ahooks';
import { useState } from 'react';
import { ReactComponent as Close } from 'assets/img/modal-close.svg';
import Loading from 'components/Loading';
import useTelegram from 'hooks/useTelegram';
import clsx from 'clsx';

export interface ILoadingProps {
  visible?: boolean;
  content?: string;
  showClose?: boolean;
  onClose?: () => void;
}

export function NiceLoading({ showClose = false, content, onClose }: ILoadingProps) {
  const [isMount, setIsMount] = useState(false);
  const { isInTG } = useTelegram();

  const modal = useModal();

  useMount(() => {
    setIsMount(true);
  });

  if (!isMount) return null;

  return (
    <Modal
      maskClosable={false}
      className={`${styles.loading} ${showClose && styles.loadingWithClose} ${isInTG && styles.loadingDark}`}
      open={modal.visible}
      rootClassName={clsx(isInTG && styles.loadingDarkWrap)}
      footer={null}
      onCancel={modal.hide}
      closable={false}
      closeIcon={null}
      centered>
      <section className="flex flex-col justify-center items-center">
        <Loading color={isInTG ? 'purple' : 'blue'} />
        <span
          className={clsx(
            'mt-[12px] text-sm font-normal text-center',
            isInTG ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
          )}>
          {content || 'loading...'}
        </span>
      </section>
      {showClose && (
        <Close
          className={clsx('absolute right-[12px] top-[12px] cursor-pointer', isInTG && styles['dark-close-icon'])}
          onClick={() => {
            onClose?.();
            modal.hide();
          }}
        />
      )}
    </Modal>
  );
}

export default NiceModal.create(NiceLoading);
