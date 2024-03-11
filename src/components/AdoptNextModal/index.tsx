import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import Balance from 'components/Balance';
import CommonModal from 'components/CommonModal';
import TransactionFee from 'components/TransactionFee';
import NoticeBar from 'components/NoticeBar';
import SGRTokenInfo from 'components/SGRTokenInfo';
import TraitsList from 'components/TraitsList';
import AIImageSelect, { TAIImage } from 'components/AIImageSelect';
import { PropsWithChildren, useCallback, useState } from 'react';
import { IAdoptNextData } from './type';
interface IDescriptionItemProps extends PropsWithChildren {
  title: string;
  tip?: string;
}

function DescriptionItem({ title, tip, children }: IDescriptionItemProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="text-lg font-medium">{title}</div>
      {children}
    </div>
  );
}

interface IAdoptNextModal<T> {
  data: IAdoptNextData;
  onConfirm: (item?: T) => void;
  onClose?: () => void;
}

function AdoptNextModal({ data, onConfirm, onClose }: IAdoptNextModal<TAIImage>) {
  const modal = useModal();
  const [selectImage, setSelectImage] = useState<TAIImage>();
  const { SGRToken, newTraits, images, inheritedTraits, transaction, balance } = data;

  const onSelect = useCallback((item: TAIImage) => {
    setSelectImage(item);
  }, []);

  const onClick = useCallback(() => onConfirm(selectImage), [onConfirm, selectImage]);
  const onCancel = useCallback(() => {
    if (onClose) return onClose();
    modal.hide();
  }, [modal, onClose]);

  return (
    <CommonModal
      title={'Successfully Adopted the Next Generation Item!'}
      open={modal.visible}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={
        <Button className="w-[356px]" disabled={!selectImage} onClick={onClick} type="primary">
          Confirm
        </Button>
      }>
      <div className="flex flex-col gap-[24px] lg:gap-[32px]">
        <NoticeBar text="Please do not close this pop-up window." />
        <SGRTokenInfo {...SGRToken} />
        <DescriptionItem title="New Traits You Got">
          <TraitsList data={newTraits} showNew />
        </DescriptionItem>
        <DescriptionItem title="Please select the image you like to complete the whole process.">
          <AIImageSelect list={images} onSelect={onSelect} />
        </DescriptionItem>
        <DescriptionItem title="Inherited Traits">
          <TraitsList data={inheritedTraits} />
        </DescriptionItem>
        <TransactionFee {...transaction} />
        <Balance
          items={[
            {
              amount: `${balance.amount} ELF`,
              usd: `${balance.usd}`,
            },
          ]}
        />
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptNextModal);
