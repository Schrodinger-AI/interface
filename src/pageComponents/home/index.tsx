import DefaultPage from './defaultPage';
import { cmsInfo } from '../../../mock';
import CountDownPage from './CounDownPage';
import BigNumber from 'bignumber.js';

export default function Home() {
  //TODO:
  if (BigNumber(new Date().getTime()).lt(BigNumber(cmsInfo.openTimeStamp))) {
    return <CountDownPage />;
  }

  return <DefaultPage />;
}
