import { Modal } from 'aelf-design';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useCallback, useMemo } from 'react';
import MarketItem from 'components/MarketItem';
import { useCmsInfo } from 'redux/hooks';
import { jsonParse } from 'utils/common';
import { TTradeItem } from 'redux/types/reducerTypes';
import { openExternalLink } from 'utils/openlink';

export interface IMarketModalProps {
  title: string;
  isTrade?: boolean;
  symbol?: string;
}
function MarketModal({ title, isTrade = false, symbol = 'SGR' }: IMarketModalProps) {
  const modal = useModal();
  const { tradeDescription = '', tradeList = '', forestUrl, curChain } = useCmsInfo() || {};
  const list = useMemo<TTradeItem[]>(() => jsonParse(tradeList), [tradeList]);

  const onItemClick = useCallback(
    (item: TTradeItem) => {
      console.log('isTrade', isTrade);
      const itemTitle = item?.title?.toLocaleLowerCase() || '';
      if (!isTrade || itemTitle !== 'forest') openExternalLink(item.link, '_blank');
      // forest item
      openExternalLink(`${forestUrl}/detail/buy/${curChain}-${symbol}/${curChain}`, '_blank');
    },
    [curChain, forestUrl, isTrade, symbol],
  );

  return (
    <Modal centered open={modal.visible} onCancel={modal.hide} afterClose={modal.remove} title={title} footer={null}>
      <div className="flex flex-col gap-4">
        <div className="text-sm text-neutralPrimary">{tradeDescription}</div>
        <div className="flex flex-col gap-4">
          {list?.map((item, index) => (
            <MarketItem key={index} data={item} onClick={onItemClick} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default NiceModal.create(MarketModal);
