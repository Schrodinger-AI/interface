import { useSelector } from 'react-redux';
import { selectInfo } from 'redux/reducer/info';

const useGetStoreInfo = () => {
  const info = useSelector(selectInfo);
  return {
    cmsInfo: info.cmsInfo,
    isJoin: info.isJoin,
    curViewListType: info.curViewListType,
  };
};

export default useGetStoreInfo;
