import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Loading from '.';

export function NiceLoading({ showClose = false, content }: { showClose?: boolean; content?: string }) {
  const modal = useModal();
  return <Loading visible={modal.visible} showClose={showClose} onClose={modal.hide} content={content} />;
}

export default NiceModal.create(NiceLoading);
