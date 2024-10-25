import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Image from 'next/image';
import loadingCatWhite from 'assets/img/loading-cat-white.gif';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';
import { ReactComponent as InfoSVG } from 'assets/img/telegram/spin/info.svg';

function TGAdoptLoading() {
  const modal = useModal();
  return (
    <TgModal
      title="DETAILS"
      open={modal.visible}
      hideHeader={false}
      maskClosable={false}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}>
      <div className="p-[8px]">
        <Flex align="center" gap={24} vertical>
          <Image src={loadingCatWhite} alt="" className="w-[120px] h-[120px] rounded-[8px] z-10" />
          <Flex align="stretch" gap={16} className="p-[16px] bg-pixelsModalTextBg rounded-[8px]">
            <div className="flex items-center w-[20px] shrink">
              <InfoSVG />
            </div>
            <p className="text-white leading-[22px] text-[14px] font-medium ">
              Please do not close this window until adoption is completed
            </p>
          </Flex>
        </Flex>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(TGAdoptLoading);
