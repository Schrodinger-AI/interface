import { Modal } from 'aelf-design';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useMemo } from 'react';
import MarketItem from 'components/MarketItem';
import { useCmsInfo } from 'redux/hooks';
import { jsonParse } from 'utils/common';
import { TTradeItem } from 'redux/types/reducerTypes';

function MarketModal({ title }: { title: string }) {
  const modal = useModal();
  const { tradeDescription = '', tradeList = '' } = useCmsInfo() || {};
  const list = useMemo<TTradeItem[]>(() => jsonParse(tradeList), [tradeList]);

  console.log('list', list);

  return (
    <Modal centered open={modal.visible} onCancel={modal.hide} afterClose={modal.remove} title={title} footer={null}>
      <div className="flex flex-col gap-4">
        <div className="text-sm text-neutralPrimary">{tradeDescription}</div>
        <div className="flex flex-col gap-4">
          {list?.map((item, index) => (
            <MarketItem key={index} data={item} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default NiceModal.create(MarketModal);
