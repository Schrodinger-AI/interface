import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Button } from 'aelf-design';

function TipsModal({
  title = 'Note:',
  closable = true,
  innerText,
  theme = 'light',
  btnText,
  onCancel,
  onConfirm,
}: {
  title?: string;
  closable?: boolean;
  innerText?: string;
  theme?: TModalTheme;
  btnText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  const modal = useModal();

  const confirmBtn = useMemo(
    () => (
      <Button
        className={clsx('w-full lg:w-[356px]', theme === 'dark' ? 'primary-button-dark' : '')}
        onClick={onConfirm}
        type="primary">
        {btnText}
      </Button>
    ),
    [btnText, onConfirm, theme],
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
      footer={btnText ? confirmBtn : null}>
      <div className="flex flex-col gap-6">
        {innerText ? (
          <span
            className={clsx('text-sm lg:text-base', theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
            {innerText}
          </span>
        ) : null}
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(TipsModal);
