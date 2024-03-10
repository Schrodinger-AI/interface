import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import Balance from 'components/Balance';
import CommonModal from 'components/CommonModal';
import InfoCard, { IInfoCard } from 'components/InfoCard';
import SGRAmountInput, { ISGRAmountInputInterface, ISGRAmountInputProps } from 'components/SGRAmountInput';
import SGRInfoList from 'components/SGRInfoList';
import { ReactNode, useCallback, useRef, useState } from 'react';

export type TBalanceItem = {
  amount: string;
  suffix: string;
  usd: string;
};

export type TAdoptActionModalProps = {
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
  onConfirm?: (amount: string) => void;
  content?: {
    title?: string | ReactNode;
    content?: string | string[] | ReactNode;
  };
  balanceList?: TBalanceItem[];
  inputProps?: ISGRAmountInputProps;
};

function AdoptActionModal(params: TAdoptActionModalProps) {
  const modal = useModal();
  const {
    modalTitle,
    title,
    info,
    buttonConfig,
    onClose,
    onConfirm: onConfirmProps,
    content,
    balanceList,
    inputProps,
  } = params;
  const sgrAmountInputRef = useRef<ISGRAmountInputInterface>();

  const onCancel = () => {
    if (onClose) {
      onClose();
      return;
    }
    modal.hide();
  };

  const [isInvalid, setIsInvalid] = useState(true);
  const isInvalidRef = useRef(isInvalid);
  isInvalidRef.current = isInvalid;
  const onConfirm = useCallback(() => {
    if (isInvalidRef.current) return;
    const sgrAmountInput = sgrAmountInputRef.current;
    if (!sgrAmountInput) return;
    const amount = sgrAmountInput.getAmount();
    onConfirmProps && onConfirmProps(amount);
  }, [onConfirmProps]);

  return (
    <CommonModal
      title={modalTitle}
      open={modal.visible}
      onOk={() => onConfirm && onConfirm()}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={
        <Button disabled={isInvalid} onClick={() => onConfirm && onConfirm()} type="primary">
          Adopt
        </Button>
      }>
      <InfoCard {...info} />
      <SGRAmountInput
        ref={sgrAmountInputRef}
        title="Enter the item amount you want to consume to adopt"
        description="The more adopt amount you enter, the more images will be peeked. "
        className="mt-[32px]"
        onInvalidChange={setIsInvalid}
        {...inputProps}
      />
      <SGRInfoList className="mt-[32px]" />
      {balanceList && balanceList.length && <Balance items={balanceList} className="mt-[32px]" />}
    </CommonModal>
  );
}

export default NiceModal.create(AdoptActionModal);
