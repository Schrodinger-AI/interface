import { useWalletService } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useTimeoutFn } from 'react-use';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useDisconnect } from 'wagmi';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { useCmsInfo } from 'redux/hooks';
import useGetPointsData from './hooks/useGetPointsData';
import TokenEarnCard from './components/TokenEarnCard';

export default function PointsPage() {
  const { wallet } = useWalletService();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const [hasBoundAddress, setHasBoundAddress] = useState<boolean>(false);
  const [boundEvmAddress, setBoundEvmAddress] = useState<string>();
  const { disconnect } = useDisconnect();
  const { jumpToPage } = useJumpToPage();
  const cmsInfo = useCmsInfo();

  const { data, loading, getPointsData } = useGetPointsData();

  const saveBoundEvmAddress = (response: IGetPointsData) => {
    setHasBoundAddress(response.hasBoundAddress);
    setBoundEvmAddress(response.evmAddress);
  };

  const toBindAddress = useCallback(async () => {
    setHasBoundAddress(true);
    getPointsData(wallet.address, (response) => {
      saveBoundEvmAddress(response);
    });
  }, [getPointsData, wallet.address]);

  useEffect(() => {
    if (!data) return;
    saveBoundEvmAddress(data);
  }, [data]);

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
        {cmsInfo?.pixiePoints ? (
          <p className="text-base font-medium text-neutralSecondary mt-[8px]">
            You can earn more points by operating an independent subdomain.{' '}
            <span
              className="text-brandDefault cursor-pointer"
              onClick={() => {
                jumpToPage({
                  link: cmsInfo?.pixiePoints,
                  linkType: 'externalLink',
                });
              }}>
              Become Advocate
            </span>
          </p>
        ) : null}
        <TokenEarnCard
          pointDetails={data?.pointDetails || []}
          hasBoundAddress={hasBoundAddress}
          boundEvmAddress={boundEvmAddress}
          bindAddress={toBindAddress}
        />
      </div>
    </div>
  );
}
