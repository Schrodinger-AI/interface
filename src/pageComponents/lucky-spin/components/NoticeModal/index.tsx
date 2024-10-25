import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import goText from 'assets/img/telegram/spin/go-text.png';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
          <Image src={goText} className="w-auto h-[20px]" alt="go" />
        </TGButton>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(NoticeModal);
