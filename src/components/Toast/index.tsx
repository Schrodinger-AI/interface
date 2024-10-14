import { clsx } from 'clsx';
import styles from './index.module.css';
import { useEffect, useState } from 'react';

type IProps = {
  visible: boolean;
  message: string;
  onClose?: () => void;
};

export function Toast({ visible: show, message, onClose }: IProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    show ? showToast() : setVisible(false);
  }, [show]);

  const showToast = () => {
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 2000);
  };

  return <div className={clsx(styles.toast, visible ? styles.visible : '')}>{message}</div>;
}
