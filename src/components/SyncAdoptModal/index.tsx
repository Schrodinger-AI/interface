import { Modal } from 'aelf-design';
import NoticeBar from 'components/NoticeBar';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

function SyncAdoptModal() {
  const modal = useModal();
  return (
    <Modal
      centered
      open={modal.visible}
      closable={false}
      maskClosable={true}
      afterClose={modal.remove}
      title={<div className="pb-[16px] text-2xl font-semibold">Adopt Cats</div>}
      footer={null}>
      <div className="flex flex-col gap-6">
        <NoticeBar text="Please don't close this window until you complete the adoption." />
        <div className="flex justify-center items-center gap-2">
          <div className="text-base text-center text-neutralSecondary">Generate your NFT image using AI</div>
          <img
            className="mt-1 animate-spin"
            src={require('assets/img/icons/loadingCircle.png').default.src}
            width={16}
            height={16}
            alt="loading"
          />
        </div>
      </div>
    </Modal>
  );
}

export default NiceModal.create(SyncAdoptModal);
