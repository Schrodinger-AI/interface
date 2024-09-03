import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { Button } from 'aelf-design';
import { useRouter } from 'next/navigation';
import { BUY_SGR_URL, SWAP_BUY_SGR_URL } from 'constants/router';

function TipsModal({
  title = 'Note:',
  closable = true,
  innerText,
  theme = 'light',
  showSwap = false,
  onCancel,
}: {
  title?: string;
  closable?: boolean;
  innerText?: string;
  theme?: TModalTheme;
  showSwap?: boolean;
  onCancel?: () => void;
}) {
  const modal = useModal();
  const router = useRouter();

  const onETransferClick = useCallback(() => {
    modal.hide();
    router.push(BUY_SGR_URL);
  }, [modal, router]);

  const onSwapClick = useCallback(() => {
    modal.hide();
    router.push(SWAP_BUY_SGR_URL);
  }, [modal, router]);

  const confirmBtn = useMemo(
    () => (
      <div className="w-full flex justify-center">
        {showSwap ? (
          <Button
            className={clsx(
              'flex-1 lg:w-[187px] lg:flex-none mr-[16px]',
              theme === 'dark' ? 'default-button-dark hover:!bg-pixelsPageBg hover:!text-pixelsWhiteBg' : '',
            )}
            onClick={onETransferClick}
            type="default">
            Buy with USDT
          </Button>
        ) : (
          <Button
            className={clsx(
              'flex-1 lg:w-[187px] lg:flex-none mr-[16px]',
              theme === 'dark' ? 'primary-button-dark hover:!bg-pixelsCardBg hover:!text-pixelsWhiteBg' : '',
            )}
            onClick={onETransferClick}
            type="primary">
            Buy with USDT
          </Button>
        )}

        {showSwap ? (
          <Button
            className={clsx(
              'flex-1 lg:w-[187px] lg:flex-none',
              theme === 'dark' ? 'primary-button-dark hover:!bg-pixelsCardBg hover:!text-pixelsWhiteBg' : '',
            )}
            onClick={onSwapClick}
            type="primary">
            Swap
          </Button>
        ) : null}
      </div>
    ),
    [onETransferClick, onSwapClick, showSwap, theme],
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
