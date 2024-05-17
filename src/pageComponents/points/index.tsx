import { getPoints } from 'api/request';
import { TokenEarnList } from 'components/EarnList';
import { useWalletService } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useRequest } from 'ahooks';
import { useTimeoutFn } from 'react-use';
import useLoading from 'hooks/useLoading';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useDisconnect } from 'wagmi';

export default function PointsPage() {
  const { wallet } = useWalletService();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const { showLoading, closeLoading } = useLoading();
  const [hasBoundAddress, setHasBoundAddress] = useState<boolean>(false);
  const { disconnect } = useDisconnect();

  const getPointsData = useCallback(
    async (address: string) => {
      if (!address) return;
      showLoading();
      const response = await getPoints({
        domain: document.location.host,
        address: address,
      });
      setHasBoundAddress(response.hasBoundAddress);
      closeLoading();
      return response;
    },
    [closeLoading, showLoading],
  );

  const { data, loading } = useRequest(() => getPointsData(wallet.address), {
    pollingInterval: 1000 * 60,
    refreshDeps: [wallet.address],
    onError: (err) => {
      console.error('getPointsDataError', err);
    },
  });

  const toBindAddress = async () => {
    setHasBoundAddress(true);
    getPointsData(wallet.address);
  };

  useTimeoutFn(() => {
    if (!isLogin) {
      disconnect();
      router.push('/');
    }
  }, 3000);

  if (loading) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px]">
        <h1 className="pt-[24px] pb-[8px] font-semibold text-2xl">Details of credits token earned for this domain</h1>
        {data?.pointDetails.length ? (
          <TokenEarnList
            dataSource={data?.pointDetails || []}
            hasBoundAddress={hasBoundAddress}
            bindAddress={toBindAddress}
          />
        ) : (
          <p className="pt-[24px] pb-[8px] text-[#919191] text-lg text-center">No flux points yet.</p>
        )}
      </div>
    </div>
  );
}
