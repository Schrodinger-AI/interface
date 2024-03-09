import CountDownPage from './CounDownPage';
import BigNumber from 'bignumber.js';
import ErrorPage from 'components/ErrorPage';
import HomePage from './homePage';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';

export default function Home() {
  const { cmsInfo } = useGetStoreInfo();
  console.log('cmsInfo', cmsInfo);
  return <HomePage />;
  if (BigNumber(new Date().getTime()).lt(BigNumber(cmsInfo?.openTimeStamp || ''))) {
    return <CountDownPage />;
  }
  return <ErrorPage />;
}
