import CountDownPage from './CounDownPage';
import BigNumber from 'bignumber.js';
import ErrorPage from 'components/ErrorPage';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';

export default function Home() {
  const { cmsInfo } = useGetStoreInfo();

  if (BigNumber(new Date().getTime()).lt(BigNumber(cmsInfo?.openTimeStamp || ''))) {
    return <CountDownPage />;
  }
  return <ErrorPage />;
}
