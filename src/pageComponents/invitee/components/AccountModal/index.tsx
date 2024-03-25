import { Modal, Button } from 'aelf-design';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import useResponsive from 'hooks/useResponsive';
import Image from 'next/image';
import styles from './style.module.css';
import { useMemo } from 'react';

interface IAccountModal {
  title: string;
  content: string;
  btnText: string;
  onOk: () => void;
}

function AccountModal({ title, content, btnText, onOk }: IAccountModal) {
  const modal = useModal();
  const { isLG } = useResponsive();

  const [tokenWidth, catWidth, [ribbonWidth, ribbonHeight]] = useMemo(() => {
    return isLG ? [32, 64, [200, 100]] : [48, 80, [280, 140]];
  }, [isLG]);

  return (
    <Modal
      centered
      width={isLG ? 343 : 438}
      className={styles['invitee-modal']}
      title={<div className="text-2xl font-semibold">{title}</div>}
      open={modal.visible}
      maskClosable={false}
      mask={false}
      closeIcon={false}
      footer={
        <Button className="w-full" type="primary" onClick={onOk}>
          {btnText}
        </Button>
      }>
      <div className="my-8 text-neutralPrimary text-base">{content}</div>
      <Image
        className="absolute lg:top-[-16px] top-[-12px] left-4"
        src={require('assets/img/referral/token.svg').default}
        width={tokenWidth}
        height={tokenWidth}
        alt="token"
      />
      <Image
        className="absolute top-[-8px] lg:right-[-24px] right-[-16px]"
        src={require('assets/img/referral/cat.svg').default}
        width={catWidth}
        height={catWidth}
        alt="cat"
      />
      <Image
        className="absolute bottom-[-40px] left-[-40px] lg:bottom-[-64px] lg:left-[-64px] z-[-1]"
        src={require('assets/img/referral/ribbon.svg').default}
        width={ribbonWidth}
        height={ribbonHeight}
        alt="ribbon"
      />
    </Modal>
  );
}

export default NiceModal.create(AccountModal);
