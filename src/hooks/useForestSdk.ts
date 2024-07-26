import { useBuy, useSell } from 'forest-ui-react';
import getNftInfo from 'utils/getNftInfo';
import { useWalletService } from './useWallet';
import useLoading from './useLoading';
import { useCmsInfo } from 'redux/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useForestSdk({ symbol, onViewNft }: { symbol: string; onViewNft: () => void }) {
  const [nftInfo, setNftInfo] = useState<INftInfo>();
  const { buyNow } = useBuy({ nftInfo, onViewNft });
  const { sell } = useSell({ nftInfo, onViewNft });
  const { showLoading, closeLoading } = useLoading();
  const { wallet } = useWalletService();
  const { curChain } = useCmsInfo() || {};

  const nftId = useMemo(() => {
    return symbol && curChain ? `${curChain}-${symbol}` : '';
  }, [curChain, symbol]);

  const initNftInfo = useCallback(async () => {
    if (!nftId || !wallet.address) return;
    showLoading();
    const nftInfo = await getNftInfo({
      nftId,
      address: wallet.address,
    });
    closeLoading();
    if (nftInfo) setNftInfo(nftInfo);
  }, [closeLoading, nftId, showLoading, wallet.address]);

  useEffect(() => {
    initNftInfo();
  }, [initNftInfo]);

  return {
    nftInfo,
    buyNow,
    sell,
  };
}
