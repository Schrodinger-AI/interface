import { Modal } from 'aelf-design';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useCallback, useMemo } from 'react';
import MarketItem from 'components/MarketItem';
import { useCmsInfo } from 'redux/hooks';
import { jsonParse } from 'utils/common';
import { TTradeItem } from 'redux/types/reducerTypes';
import { openExternalLink } from 'utils/openlink';
import { TSGRToken } from 'types/tokens';
import { divDecimals } from 'utils/calculate';
import { ONE } from 'constants/misc';

export interface IMarketModalProps {
  title: string;
  isTrade?: boolean;
  detail?: TSGRToken;
}
function MarketModal({ title, isTrade = false, detail }: IMarketModalProps) {
  const modal = useModal();
  const { tradeDescription = '', tradeList = '', forestUrl, curChain } = useCmsInfo() || {};
  const list = useMemo<TTradeItem[]>(() => {
    const _list: TTradeItem[] = jsonParse(tradeList) || [];
    if (!isTrade || !detail) return _list;
    const { amount, decimals, generation } = detail;
    if (generation === 0) return _list;
    if (divDecimals(amount, decimals).lt(ONE)) {
      return _list.filter((item) => item.title.toLocaleLowerCase() !== 'forest');
    }
    return _list;
  }, [detail, isTrade, tradeList]);

  const onItemClick = useCallback(
    (item: TTradeItem) => {
      const itemTitle = item?.title?.toLocaleLowerCase() || '';
      if (!isTrade || itemTitle !== 'forest') openExternalLink(item.link, '_blank');
      // forest item
      const { symbol } = detail || {};
      openExternalLink(`${forestUrl}/detail/buy/${curChain}-${symbol}/${curChain}`, '_blank');
    },
    [curChain, detail, forestUrl, isTrade],
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
