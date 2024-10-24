import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { ReactComponent as GoSVG } from 'assets/img/telegram/spin/Go.svg';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function NoticeModal({
  title = 'Notice',
  tips = 'Oh no, you do not have enough $Fish. Complete tasks to get more $Fish!',
}: {
  title?: string;
  tips?: string;
}) {
  const modal = useModal();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    modal.hide();
  }, [modal, pathname]);

  return (
    <TgModal
      title={title}
      open={modal.visible}
      hideHeader={false}
      afterClose={modal.remove}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}>
      <div className="p-[8px]">
        <p className="text-center text-white text-[12px] font-medium">{tips}</p>
        <TGButton type="success" className="w-full mt-[24px]" onClick={() => router.push('/telegram/tasks')}>
          <GoSVG />
        </TGButton>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(NoticeModal);
