import { Modal } from 'aelf-design';
import NoticeBar from 'components/NoticeBar';
import Loading from 'components/Loading';

interface ISyncAdoptModal {
  open: boolean;
}

export default function SyncAdoptModal({ open }: ISyncAdoptModal) {
  return (
    <Modal
      open={open}
      closable={false}
      maskClosable={true}
      title={<div className="pb-[8px] text-2xl font-semibold">Pending Adopt</div>}
      footer={null}>
      <NoticeBar text="Please do not close this pop-up window." />
      <div className="text-[14px] leading-[22px] text-center py-[20px]">Waiting for AI to generate images</div>
      <div className="flex justify-center">
        <Loading color="blue" />
      </div>
      <div className="text-center text-base font-semibold pt-8 pb-2">Generating images on the Chain...</div>
    </Modal>
  );
}
