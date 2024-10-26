import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal from 'components/CommonModal';
import { useCallback } from 'react';
import { Flex } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import TGButton from 'components/TGButton';
import { useRouter } from 'next/navigation';

const commonItem = {
  adoptImageInfo: {
    describe: 'Common,,',
    images: [],
    attributes: [],
    generation: 9,
    boxImage: 'https://schrodinger-testnet.s3.amazonaws.com/30b0a134-ca62-46ea-98fa-b079ae992b2c.png',
  },
  image: '',
  signature: '',
  imageUri: '',
};

function FakeAdoptResultModal() {
  const modal = useModal();
  const router = useRouter();

  const onCancel = useCallback(() => {
    modal.hide();
  }, [modal]);

  const toSpin = () => {
    modal.hide();
    router.push('/telegram/spin-pool');
  };

  return (
    <CommonModal
      title={'Instant Adopt GEN9 Cat'}
      titleClassName="!font-black !text-pixelsWhiteBg"
      open={modal.visible}
      onOk={onCancel}
      theme={'dark'}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={
        <TGButton type="success" size="large" className="w-full mt-[24px]" onClick={toSpin}>
          Go To Spin
        </TGButton>
      }>
      <Flex align="stretch" gap={16} className="p-[16px] bg-pixelsModalTextBg rounded-[8px]">
        <div className="flex items-center w-[24px] shrink">
          <img
            src={require('assets/img/telegram/spin/Strong.png').default.src}
            alt=""
            className="w-[24px] h-[24px] z-10"
          />
        </div>
        <p className="text-white leading-[22px] text-[14px] font-medium ">Keep trying to get Rare GEN9 cats!</p>
      </Flex>
      <SkeletonImage
        img={commonItem?.adoptImageInfo?.boxImage}
        tag={`GEN ${commonItem?.adoptImageInfo?.generation}`}
        rarity={commonItem?.adoptImageInfo?.describe}
        imageSizeType="contain"
        className="mt-[16px] !rounded-[8px] shadow-btnShadow"
        imageClassName="!rounded-[4px]"
        tagPosition="small"
      />

      <Flex align="stretch" gap={16} className="mt-[16px] p-[16px] bg-pixelsModalTextBg rounded-[8px]">
        <div className="flex items-center w-[20px] shrink">
          <img src={require('assets/img/info.png').default.src} alt="" className="w-[20px] h-[20px] z-10" />
        </div>
        <p className="text-white leading-[22px] text-[14px] font-medium ">
          Common GEN9 cats will run off and disappear.
        </p>
      </Flex>

      <Flex align="stretch" gap={16} className="mt-[16px] p-[16px] bg-pixelsModalTextBg rounded-[8px]">
        <div className="flex items-center w-[20px] shrink">
          <img src={require('assets/img/info.png').default.src} alt="" className="w-[20px] h-[20px] z-10" />
        </div>
        <p className="text-white leading-[22px] text-[14px] font-medium ">
          Play Lucky Spins to get more S-CAT vouchers!
        </p>
      </Flex>
    </CommonModal>
  );
}

export default NiceModal.create(FakeAdoptResultModal);
