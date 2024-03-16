import CountDownPage from './CounDownPage';
import BigNumber from 'bignumber.js';
import ErrorPage from 'components/ErrorPage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';

export default function Home() {
  const { cmsInfo } = useGetStoreInfo();
  const router = useRouter();
  useEffect(() => {
    const currentTime = new Date().getTime();
    if (!BigNumber(cmsInfo?.openTimeStamp || 0).gt(currentTime)) {
      router.replace('/');
    }
  }, [cmsInfo?.openTimeStamp, router]);

  if (BigNumber(new Date().getTime()).lt(BigNumber(cmsInfo?.openTimeStamp || ''))) {
    return <CountDownPage />;
  }
  return <ErrorPage />;
}
