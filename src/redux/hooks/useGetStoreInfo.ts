import { useSelector } from 'react-redux';
import { selectInfo } from 'redux/reducer/info';

const useGetStoreInfo = () => {
  const info = useSelector(selectInfo);
  return {
    cmsInfo: info.cmsInfo,
    curViewListType: info.curViewListType,
    unreadMessagesCount: info.unreadMessagesCount,
    hasNewActivities: info.hasNewActivities,
  };
};

export default useGetStoreInfo;
