/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Button, Flex } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import { ReactComponent as FailSVG } from 'assets/img/fail.svg';
import { ReactComponent as SuccessSVG } from 'assets/img/success.svg';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';

function Notice({
  status = false,
  hideCancel = false,
  catInfo,
  tips,
  onConfirm,
  onClose,
  theme = 'light',
}: {
  onConfirm?: (v?: string) => void;
  onClose?: () => void;
  status?: boolean;
  hideCancel?: boolean;
  catInfo?: {
    amount: string;
    describe: string;
    inscriptionImageUri: string;
  }[];
  tips?: string;
  theme?: TModalTheme;
}) {
  const modal = useModal();

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
        {catInfo?.length ? (
          <Flex className={clsx('w-full', tips ? 'mb-[24px]' : '')} gap={16}>
            {catInfo?.map((item, index) => (
              <div
                key={index}
                className="relative flex-1 border-[2px] border-solid border-neutralWhiteBg rounded-[8px] shadow-selectBoxShadow">
                <SkeletonImage
                  img={item.inscriptionImageUri}
                  rarity={item.describe}
                  imageSizeType="contain"
                  className="rounded-b-none"
                  imageClassName="rounded-b-none"
                  tagPosition="small"
                />

                <Flex className="w-full p-[12px]" justify="space-between">
                  {index % 2 !== 0 ? <SuccessSVG /> : <FailSVG />}
                  <div className="text-[12px] font-black text-neutralWhiteBg leading-[20px]">{item.amount}</div>
                </Flex>
              </div>
            ))}
          </Flex>
        ) : null}

        {!status ? (
          <Flex align="stretch" gap={16} className="mt-[16px] p-[16px] bg-pixelsModalTextBg rounded-[8px]">
            <div className="flex flex-none items-center w-[20px]">
              <img src={require('assets/img/info.png').default.src} alt="" className="w-[20px] h-[20px] z-10" />
            </div>
            <p className="flex-auto text-white leading-[22px] text-[14px] font-medium">
              0.25 SGR will be added to the Prize Pool on every merge, successful or not!
            </p>
          </Flex>
        ) : (
          <p
            className={clsx(
              'whitespace-pre-wrap font-semibold text-center',
              isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
            )}>
            {tips}
          </p>
        )}
      </>
    );
  };

  if (theme === 'dark') {
    return (
      <TgModal
        title="Notice"
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        onClose={handleClose}
        afterClose={handleClose}
        onOk={() => modal.hide()}
        onCancel={() => modal.hide()}
        footer={
          <Flex className="w-full" gap={8}>
            {hideCancel ? null : (
              <TGButton size="large" className="w-full" onClick={() => modal.hide()}>
                {status ? 'cancel' : 'I understand'}
              </TGButton>
            )}

            {status ? (
              <TGButton type="success" size="large" className="w-full" onClick={handleConfirm}>
                Confirm
              </TGButton>
            ) : null}
          </Flex>
        }>
        {modalContent(theme)}
      </TgModal>
    );
  } else {
    return (
      <CommonModal
        title="Notice"
        theme="light"
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        disableMobileLayout={true}
        onClose={handleClose}
        afterClose={handleClose}
        onOk={() => modal.hide()}
        onCancel={() => modal.hide()}
        footer={
          <Flex className="w-full" gap={8}>
            {hideCancel ? null : (
              <Button type="primary" size="large" className="w-full" onClick={() => modal.remove()}>
                {status ? 'cancel' : 'I understand'}
              </Button>
            )}

            {status ? (
              <Button type="primary" size="large" className="w-full" onClick={handleConfirm}>
                Confirm
              </Button>
            ) : null}
          </Flex>
        }>
        {modalContent(theme)}
      </CommonModal>
    );
  }
}

export default NiceModal.create(Notice);
