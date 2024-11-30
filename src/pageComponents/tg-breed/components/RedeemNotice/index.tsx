/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Button, Flex } from 'antd';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { ReactComponent as InfoSVG } from 'assets/img/icons/info.svg';
import { useResponsive } from 'hooks/useResponsive';
import { useCmsInfo } from 'redux/hooks';

function RedeemNotice({
  tips,
  onConfirm,
  onClose,
  theme = 'light',
  title,
}: {
  title?: string;
  onConfirm?: (v?: string) => void;
  onClose?: () => void;
  tips?: string;
  theme?: TModalTheme;
}) {
  const modal = useModal();
  const cmsInfo = useCmsInfo();
  const { isLG } = useResponsive();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      modal.remove();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      modal.remove();
    }
  };

  const modalContent = (theme: TModalTheme) => {
    const isDark = theme === 'dark';
    return (
      <>
        <p
          className={clsx(
            'whitespace-pre-wrap text-sm lg:text-xl font-semibold text-center',
            isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
          )}>
          <span className="inline-block max-w-[180px] lg:max-w-[260px]">
            {tips || 'Are you sure you want to redeem your prize?'}
          </span>
        </p>
        <Flex
          align="stretch"
          gap={16}
          className={clsx(
            'mt-[16px] p-[16px]',
            isDark ? 'rounded-[8px] bg-pixelsModalTextBg' : 'rounded-[12px] bg-brandBg',
          )}>
          <div className="flex flex-none items-center w-[20px]">
            {isDark ? (
              <img src={require('assets/img/info.png').default.src} alt="" className="w-[20px] h-[20px] z-10" />
            ) : (
              <InfoSVG className="w-[20px] h-[20px] z-10" />
            )}
          </div>
          <p
            className={clsx(
              'flex-auto leading-[22px] text-[14px] font-medium',
              isDark ? 'text-white' : 'text-neutralTitle',
            )}>
            Your {cmsInfo?.winningCatLevel || 'Gold III'} NFT will be burnt upon prize collection.
          </p>
        </Flex>
      </>
    );
  };

  if (theme === 'dark') {
    return (
      <TgModal
        title={title || 'Notice'}
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        onClose={handleClose}
        afterClose={handleClose}
        onOk={() => modal.hide()}
        onCancel={() => modal.hide()}
        footer={
          <TGButton type="success" size="large" className="w-full" onClick={handleConfirm}>
            Confirm
          </TGButton>
        }>
        {modalContent(theme)}
      </TgModal>
    );
  } else {
    return (
      <CommonModal
        title={title || 'Notice'}
        theme="light"
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        disableMobileLayout={true}
        onClose={handleClose}
        afterClose={handleClose}
        width={isLG ? '' : 438}
        onOk={() => modal.hide()}
        onCancel={() => modal.hide()}
        footer={
          <div className="w-full px-0 lg:px-[32px]">
            <Button type="primary" size="large" className="w-full" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        }>
        {modalContent(theme)}
      </CommonModal>
    );
  }
}

export default NiceModal.create(RedeemNotice);
