import NiceModal, { useModal } from '@ebay/nice-modal-react';
import NiceLoading from 'components/Loading/NiceLoading';

export default function useLoading() {
  const modal = useModal(NiceLoading);

  const showLoading = (props?: { showClose?: boolean; content?: string }) => {
    modal.show({ showClose: props?.showClose, content: props?.content });
  };

  const closeLoading = () => {
    modal.hide();
  };

  return {
    showLoading,
    closeLoading,
  };
}
