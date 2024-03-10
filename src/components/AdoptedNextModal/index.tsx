import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import Balance from 'components/Balance';
import CommonModal from 'components/CommonModal';
import TransactionFee from 'components/TransactionFee';
import NoticeBar from 'components/NoticeBar';

interface IAdoptedNextModal {
  title?: string;
}

function AdoptedNextModal(props: IAdoptedNextModal) {
  const modal = useModal();
  const { title } = props;
  return (
    <CommonModal title={title} open={modal.visible} afterClose={modal.remove} footer={<Button>Confirm</Button>}>
      <div className="flex flex-col gap-[24px] lg:gap-[32px]">
        <NoticeBar text="Please do not close this pop-up window." />
        <TransactionFee fee={0.92} usd={0.45} />
        <Balance
          items={[
            {
              amount: '1000 ELF',
              usd: '0.45',
            },
          ]}
        />
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptedNextModal);
