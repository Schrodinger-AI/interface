import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Image from 'next/image';
import loadingCat from 'assets/img/loading-cat-transparent.gif';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';

function TGAdoptLoading({ innerText, title }: { innerText?: string; title?: string }) {
  const modal = useModal();
  return (
    <TgModal
      title={title || 'Adopting Cat...'}
      open={modal.visible}
      hideHeader={false}
      maskClosable={false}
      closable={false}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}>
      <div className="p-[8px]">
        <Flex align="center" gap={24} vertical>
          <Image src={loadingCat} alt="" className="w-[120px] h-[120px] rounded-[8px] z-10" />
          <Flex align="stretch" gap={16} className="p-[16px] bg-pixelsModalTextBg rounded-[8px]">
            <div className="flex flex-none items-center w-[20px]">
              <img src={require('assets/img/info.png').default.src} alt="" className="w-[20px] h-[20px] z-10" />
            </div>
            <p className="flex-auto text-white leading-[22px] text-[14px] font-medium ">
              {innerText || 'Please do not close this window until adoption is completed'}
            </p>
          </Flex>
        </Flex>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(TGAdoptLoading);
