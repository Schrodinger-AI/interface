import { Modal } from 'aelf-design';
import NoticeBar from 'components/NoticeBar';
import LoadingCircle from 'assets/img/icons/loadingCircle.png';
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
      title={<div className="pb-[16px] text-2xl font-semibold">Pending Adopt</div>}
      footer={null}>
      <div className="flex flex-col gap-6">
        <NoticeBar text="Please do not close this pop-up window." />
        <div className="flex justify-center items-center gap-2">
          <div className="text-base text-center text-neutralSecondary">Waiting for AI to generate images</div>
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
