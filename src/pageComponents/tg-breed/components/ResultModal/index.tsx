/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import { Button } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';

import clsx from 'clsx';

function ResultModal({
  type,
  catInfo,
  onConfirm,
  theme = 'light',
}: {
  type: 'success' | 'fail';
  catInfo: {
    describe: string;
    inscriptionImageUri: string;
  };
  onConfirm: () => void;
  theme?: TModalTheme;
}) {
  const modal = useModal();
  const { isLG } = useResponsive();

  const handleClose = () => {
    modal.remove();
  };

  const modalContent = () => {
    return (
      <div>
        <Flex className="w-full" justify="center" gap={16}>
          <div
            className={clsx(
              'relative w-[141px]',
              theme === 'dark'
                ? 'border-neutralWhiteBg border-[2px] border-solid rounded-[8px] shadow-selectedBoxShadow'
                : 'rounded-[12px]',
            )}>
            <SkeletonImage
              img={catInfo.inscriptionImageUri}
              rarity={catInfo.describe}
              imageSizeType="contain"
              tagPosition="small"
            />
          </div>
        </Flex>
        <p
          className={clsx(
            'mt-[12px] font-medium text-base text-center',
            theme === 'dark' ? 'text-neutralWhiteBg' : 'text-neutralTitle',
          )}>
          Check your bag for the box!
        </p>
      </div>
    );
  };

  if (theme === 'dark') {
    return (
      <TgModal
        title={type === 'success' ? 'Congratulations!' : 'Failure'}
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        onClose={handleClose}
        afterClose={handleClose}
        onCancel={() => modal.hide()}
        footer={
          <Flex className="w-full" gap={8}>
            <TGButton type="success" size="large" className="w-full" onClick={onConfirm}>
              Confirm
            </TGButton>
          </Flex>
        }>
        {modalContent()}
      </TgModal>
    );
  } else {
    return (
      <CommonModal
        title={type === 'success' ? 'Congratulations!' : 'Failure'}
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        onClose={handleClose}
        disableMobileLayout={true}
        afterClose={handleClose}
        width={isLG ? '' : 438}
        onCancel={() => modal.hide()}
        footer={
          <Flex className="w-full px-0 lg:px-[32px]" gap={8}>
            <Button type="primary" size="large" className="w-full" onClick={onConfirm}>
              Confirm
            </Button>
          </Flex>
        }>
        {modalContent()}
      </CommonModal>
    );
  }
}

export default NiceModal.create(ResultModal);
