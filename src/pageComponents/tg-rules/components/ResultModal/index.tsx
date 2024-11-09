/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';
import SkeletonImage from 'components/SkeletonImage';

const items = [
  {
    amount: 44,
    describe: 'Diamond,44,',
    inscriptionImageUri: 'https://schrodinger-testnet.s3.amazonaws.com/fb8896c7-c0e6-4ed1-a64e-4d7571e0bad3.png',
  },
];

function ResultModal({ result, onConfirm }: { result: 0 | 1; onConfirm: (v: string) => void; onClose: () => void }) {
  const modal = useModal();

  const handleClose = () => {
    modal.remove();
  };

  return (
    <TgModal
      title={result ? 'Congratulations!' : 'Failure'}
      open={modal.visible}
      hideHeader={false}
      maskClosable={true}
      onClose={handleClose}
      afterClose={handleClose}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}
      footer={
        <Flex className="w-full" gap={8}>
          <TGButton type="success" size="large" className="w-full">
            Confirm
          </TGButton>
        </Flex>
      }>
      <Flex className="w-full" justify="center" gap={16}>
        {items.map((item, index) => (
          <div
            key={index}
            className="relative w-[141px] border-[2px] border-solid border-neutralWhiteBg rounded-[8px] shadow-selectedBoxShadow">
            <SkeletonImage
              img={item.inscriptionImageUri}
              rarity={item.describe}
              imageSizeType="contain"
              tagPosition="small"
            />
          </div>
        ))}
      </Flex>
    </TgModal>
  );
}

export default NiceModal.create(ResultModal);
