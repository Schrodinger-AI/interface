import { useSelector } from 'react-redux';
import { selectInfo } from 'redux/reducer/info';

export default function useGetStoreInfo() {
  const info = useSelector(selectInfo);
  return {
    cmsInfo: info.cmsInfo,
  };
}
