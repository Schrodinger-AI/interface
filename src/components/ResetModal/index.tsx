import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Balance from 'components/Balance';
import CommonModal from 'components/CommonModal';
import InfoCard, { IInfoCard } from 'components/InfoCard';
import SGRAmountInput from 'components/SGRAmountInput';
import { ReactNode } from 'react';

interface IProps {
  title?: string;
  modalTitle?: string;
  info: IInfoCard;
  buttonConfig?:
    | {
        btnText?: string;
        onConfirm?: Function;
      }[]
    | false;
  onClose?: <T>(params?: T) => void;
  onConfirm?: <T>(params?: T) => void;
  content?: {
    title?: string | ReactNode;
    content?: string | string[] | ReactNode;
  };
}

function ResetModal(params: IProps) {
  const modal = useModal();
  const { modalTitle, title, info, buttonConfig, onClose, onConfirm, content } = params;

  const onCancel = () => {
    if (onClose) {
      onClose();
      return;
    }
    modal.hide();
  };

  return (
    <CommonModal
      title={modalTitle}
      open={modal.visible}
      onOk={() => onConfirm && onConfirm()}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={null}>
      <InfoCard {...info} />
      <SGRAmountInput
        title="Enter the item amount you want to consume to adopt"
        description="The more adopt amount you enter, the more images will be peeked. "
      />
      <Balance
        items={[
          {
            amount: '200 SGR-G',
            suffix: 'sss',
            usd: '222',
          },
          {
            amount: '200 SGR-G',
            suffix: 'sss',
            usd: '222',
          },
        ]}
      />
    </CommonModal>
  );
}

export default NiceModal.create(ResetModal);
