import { useModal } from '@ebay/nice-modal-react';
import NiceLoading from 'components/PageLoading/NiceLoading';

export default function useLoading() {
  const modal = useModal(NiceLoading);

  const showLoading = (props?: { showClose?: boolean; content?: string; onClose?: () => void }) => {
    modal.show({ showClose: props?.showClose, content: props?.content, onClose: props?.onClose });
  };

  const closeLoading = () => {
    modal.hide();
  };

  return {
    showLoading,
    closeLoading,
    visible: modal.visible,
  };
}
