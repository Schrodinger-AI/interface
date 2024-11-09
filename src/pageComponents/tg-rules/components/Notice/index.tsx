/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import { ReactComponent as FailSVG } from 'assets/img/fail.svg';
import { ReactComponent as SuccessSVG } from 'assets/img/success.svg';
import { useState } from 'react';

const items = [
  {
    amount: 44,
    describe: 'Diamond,44,',
    inscriptionImageUri: 'https://schrodinger-testnet.s3.amazonaws.com/fb8896c7-c0e6-4ed1-a64e-4d7571e0bad3.png',
  },
  {
    amount: 1,
    describe: 'Diamond,1,',
    inscriptionImageUri: 'https://schrodinger-testnet.s3.amazonaws.com/fb8896c7-c0e6-4ed1-a64e-4d7571e0bad3.png',
  },
];

const tips = `Are you sure you want \n to breed these 2 cats?`;

function Notice({ onConfirm }: { onConfirm: (v: string) => void; onClose: () => void }) {
  const modal = useModal();
  const [status, setStatus] = useState(false);

  const handleClose = () => {
    modal.remove();
  };

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
          <TGButton size="large" className="w-full">
            {status ? 'cancel' : 'I understand'}
          </TGButton>
          {status ? (
            <TGButton type="success" size="large" className="w-full">
              Confirm
            </TGButton>
          ) : null}
        </Flex>
      }>
      <Flex className="w-full" gap={16}>
        {items.map((item, index) => (
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
              <div className="text-[12px] font-black text-neutralWhiteBg leading-[20px]">{item.amount}%</div>
            </Flex>
          </div>
        ))}
      </Flex>

      {!status ? (
        <Flex align="stretch" gap={16} className="mt-[16px] p-[16px] bg-pixelsModalTextBg rounded-[8px]">
          <div className="flex flex-none items-center w-[20px]">
            <img src={require('assets/img/info.png').default.src} alt="" className="w-[20px] h-[20px] z-10" />
          </div>
          <p className="flex-auto text-white leading-[22px] text-[14px] font-medium">
            Regardless of success or failure, 0.5SGR will go to the reward pool
          </p>
        </Flex>
      ) : (
        <p className="mt-[24px] whitespace-pre-wrap font-semibold text-center text-neutralWhiteBg">{tips}</p>
      )}
    </TgModal>
  );
}

export default NiceModal.create(Notice);
