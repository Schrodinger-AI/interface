import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import { Tooltip } from 'antd';
import Balance from 'components/Balance';
import CommonModal from 'components/CommonModal';
import TransactionFee from 'components/TransactionFee';
import NoticeBar from 'components/NoticeBar';
import SGRTokenInfo from 'components/SGRTokenInfo';
import TraitsList from 'components/TraitsList';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import AIImageSelect from 'components/AIImageSelect';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { IAdoptNextData } from './type';
interface IDescriptionItemProps extends PropsWithChildren {
  title: string;
  tip?: string;
}

function DescriptionItem({ title, tip, children }: IDescriptionItemProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-2">
        <div className="text-lg font-medium">{title}</div>
        {tip && (
          <Tooltip title={tip}>
            <QuestionSVG />
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
}

interface IAdoptNextModal {
  isAcross?: boolean;
  data: IAdoptNextData;
  onConfirm?: (image: string) => void;
  onClose?: () => void;
}

function AdoptNextModal({ isAcross, data, onConfirm, onClose }: IAdoptNextModal) {
  const modal = useModal();
  const [selectImage, setSelectImage] = useState<number>(-1);
  const { SGRToken, newTraits, images, inheritedTraits, transaction, ELFBalance } = data;

  const onSelect = useCallback((index: number) => {
    setSelectImage(index);
  }, []);

  const onClick = useCallback(() => onConfirm?.(images[selectImage]), [onConfirm, selectImage]);
  const onCancel = useCallback(() => {
    if (onClose) return onClose();
    modal.hide();
  }, [modal, onClose]);

  const title = useMemo(() => {
    return (
      <div className="font-semibold">
        <div className="text-neutralTitle">Successfully Adopted the Next Generation Item!</div>
        {isAcross && (
          <div className="mt-2 text-lg text-neutralSecondary font-medium">
            Congratulations on the opportunity to adopt CATs{' '}
            <span className="text-functionalWarning">ACROSS GENERATIONS!</span>
          </div>
        )}
      </div>
    );
  }, [isAcross]);

  return (
    <CommonModal
      title={title}
      open={modal.visible}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={
        <Button className="w-[356px]" disabled={selectImage < 0} onClick={onClick} type="primary">
          Confirm
        </Button>
      }>
      <div className="flex flex-col gap-[24px] lg:gap-[32px]">
        <NoticeBar text="Please do not close this pop-up window." />
        <SGRTokenInfo {...SGRToken} />
        <DescriptionItem
          title="New Traits You Got"
          tip="A new trait type is randomly generated with this evolution. Based on the trait type, specific traits will be generated powered by AI.">
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
              amount: `${ELFBalance?.amount ?? '--'} ELF`,
              usd: `${ELFBalance?.usd ?? '--'}`,
            },
          ]}
        />
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptNextModal);
