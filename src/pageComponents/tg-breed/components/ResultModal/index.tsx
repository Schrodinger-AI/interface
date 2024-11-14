/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';
import SkeletonImage from 'components/SkeletonImage';

function ResultModal({
  type,
  catInfo,
  onConfirm,
}: {
  type: 'success' | 'fail';
  catInfo: {
    describe: string;
    inscriptionImageUri: string;
  };
  onConfirm: () => void;
}) {
  const modal = useModal();

  const handleClose = () => {
    modal.remove();
  };

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
      <Flex className="w-full" justify="center" gap={16}>
        <div className="relative w-[141px] border-[2px] border-solid border-neutralWhiteBg rounded-[8px] shadow-selectedBoxShadow">
          <SkeletonImage
            img={catInfo.inscriptionImageUri}
            rarity={catInfo.describe}
            imageSizeType="contain"
            tagPosition="small"
          />
        </div>
      </Flex>
    </TgModal>
  );
}

export default NiceModal.create(ResultModal);
