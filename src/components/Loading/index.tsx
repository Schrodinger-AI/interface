import { Modal } from 'antd';
import styles from './style.module.css';
import { useLottie } from 'lottie-react';
import LoadingAnimation from 'assets/img/loading-animation.json';
import { useMount } from 'ahooks';
import { useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { ReactComponent as Close } from 'assets/img/modal-close.svg';

export interface ILoadingProps {
  visible?: boolean;
  content?: string;
  showClose?: boolean;
  onClose?: () => void;
}

export default function Loading({
  visible = true,
  showClose = false,
  content,
  onClose,
}: ILoadingProps) {
  const [isMount, setIsMount] = useState(false);

  useMount(() => {
    setIsMount(true);
  });

  const Animation = () => {
    const options = {
      animationData: LoadingAnimation,
      loop: true,
      autoplay: true,
    };

    const { View } = useLottie(options, { width: '40px', height: '40px' });

    return View;
  };

  if (!isMount) return null;

  return (
    <Modal
      className={`${styles.loading} ${showClose && styles.loadingWithClose}`}
      open={visible}
      footer={null}
      closable={false}
      closeIcon={null}
    >
      <section className="flex flex-col justify-center items-center">
        <Animation />
        <span className="mt-[12px] text-[#1A1A1A] text-[14px] leading-[20px] font-normal text-center">
          {content || 'loading...'}
        </span>
      </section>
      {showClose && (
        <Close
          className="absolute right-[12px] top-[12px] cursor-pointer"
          onClick={() => {
            onClose?.();
          }}
        />
      )}
    </Modal>
  );
}
