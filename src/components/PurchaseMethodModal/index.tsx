import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { Button } from 'aelf-design';
import { TBuyType } from 'hooks/useBuyToken';
import { useRouter } from 'next/navigation';
import { BUY_ELF_URL, BUY_SGR_URL, SWAP_BUY_ELF_URL, SWAP_BUY_SGR_URL } from 'constants/router';

// TODO
function PurchaseMethodModal({
  type,
  title = 'Note:',
  closable = true,
  innerText,
  theme = 'light',
  btnText,
  onCancel,
  onConfirmCallback,
}: {
  type: TBuyType;
  title?: string;
  closable?: boolean;
  innerText?: string;
  theme?: TModalTheme;
  btnText?: string;
  onCancel?: () => void;
  onConfirmCallback?: () => void;
}) {
  const modal = useModal();
  const router = useRouter();

  const onETransferClick = useCallback(() => {
    modal.hide();
    router.push(type === 'buySGR' ? BUY_SGR_URL : BUY_ELF_URL);
    onConfirmCallback && onConfirmCallback();
  }, [modal, onConfirmCallback, router, type]);

  const onSwapClick = useCallback(() => {
    modal.hide();
    router.push(type === 'buySGR' ? SWAP_BUY_SGR_URL : SWAP_BUY_ELF_URL);
    onConfirmCallback && onConfirmCallback();
  }, [modal, onConfirmCallback, router, type]);

  const confirmBtn = useMemo(
    () => (
      <div>
        <Button
          className={clsx('w-full lg:w-[356px]', theme === 'dark' ? 'primary-button-dark' : '')}
          onClick={onETransferClick}
          type="primary">
          etransfer
        </Button>
        <Button
          className={clsx('w-full lg:w-[356px]', theme === 'dark' ? 'primary-button-dark' : '')}
          onClick={onSwapClick}
          type="primary">
          Swap
        </Button>
      </div>
    ),
    [onETransferClick, onSwapClick, theme],
  );

  const onClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      modal.hide();
    }
  };

  return (
    <CommonModal
      centered
      open={modal.visible}
      closable={closable}
      maskClosable={true}
      onCancel={onClose}
      afterClose={modal.remove}
      theme={theme}
      disableMobileLayout={true}
      title={title}
      footer={confirmBtn}>
      <div className="flex flex-col gap-6"></div>
    </CommonModal>
  );
}

export default NiceModal.create(PurchaseMethodModal);
