import { getPoints } from 'api/request';
import { TokenEarnList } from 'components/EarnList';
import { useWalletService } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useRequest } from 'ahooks';

export default function PointsPage() {
  const { isLogin } = useWalletService();
  const router = useRouter();
  const { wallet } = useWalletService();

  const getPointsData = useCallback(async () => {
    if (!wallet.address) return;
    const response = await getPoints({
      domain: document.location.host,
      address: wallet.address,
    });
    return response;
  }, [wallet]);

  const { data } = useRequest(getPointsData, {
    pollingInterval: 1000 * 60,
    onError: (err) => {
      console.error('getPointsDataError', err);
    },
  });

  useEffect(() => {
    if (!isLogin) {
      router.push('/');
    }
  }, [isLogin, router]);

  return (
    <div className="w-full max-w-[1360px]">
      <h1 className="pt-[24px] pb-[8px] font-semibold text-2xl">Details of credits token earned for this domain</h1>
      <TokenEarnList dataSource={data?.pointDetails || []} />
    </div>
  );
}
