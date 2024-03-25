import { useWebLogin } from 'aelf-web-login';
import CountDownPage from './CounDownPage';
import BigNumber from 'bignumber.js';
import ErrorPage from 'components/ErrorPage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import { canUseWhenNoStart } from 'redux/utils';

export default function Home() {
  const { cmsInfo } = useGetStoreInfo();
  const { wallet } = useWebLogin();
  const router = useRouter();
  useEffect(() => {
    const currentTime = new Date().getTime();
    const canUse = canUseWhenNoStart(wallet.address);
    if (BigNumber(cmsInfo?.openTimeStamp || 0).lte(currentTime) || canUse) {
      router.replace('/');
    }
  }, [cmsInfo?.openTimeStamp, router, wallet.address]);

  if (BigNumber(new Date().getTime()).lt(BigNumber(cmsInfo?.openTimeStamp || ''))) {
    return <CountDownPage />;
  }
  return <ErrorPage />;
}
