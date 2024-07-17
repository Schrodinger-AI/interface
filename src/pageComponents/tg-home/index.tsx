'use client';

import { Button } from 'aelf-design';
import { getCatDetail } from 'api/request';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useWalletService } from 'hooks/useWallet';
import { useCallback, useEffect, useState } from 'react';
import { useCmsInfo } from 'redux/hooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { TSGRTokenInfo } from 'types/tokens';

export default function TgHome() {
  const adoptHandler = useAdoptHandler();
  const { wallet } = useWalletService();
  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const { isLogin } = useGetLoginStatus();
  const cmsInfo = useCmsInfo();

  const getDetail = useCallback(async () => {
    if (wallet.address && !isLogin) return;
    try {
      const result = await getCatDetail({ symbol: 'SGR-1', chainId: cmsInfo?.curChain || '', address: wallet.address });
      setSchrodingerDetail(result);
    } catch (error) {
      /* empty */
    }
  }, [cmsInfo?.curChain, isLogin, wallet.address]);

  const OpenAdoptModal = () => {
    if (!wallet.address || !schrodingerDetail) return;
    adoptHandler({
      parentItemInfo: schrodingerDetail,
      account: wallet.address,
      isDirect: true,
      theme: 'dark',
    });
  };

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      <Button onClick={OpenAdoptModal} disabled={!wallet.address || !schrodingerDetail}>
        Adopt
      </Button>
    </div>
  );
}
