import { useSelector } from 'react-redux';
import { getPoints } from 'redux/reducer/userInfo';

const useGetPoints = () => {
  const points = useSelector(getPoints);
  return {
    points,
  };
};

export default useGetPoints;
