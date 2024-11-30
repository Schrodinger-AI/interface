import { fetchTasksList } from 'api/request';
import { useCallback, useEffect, useState } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

function useGetUnfinishedTasks() {
  const [hasUnfinishedTasks, setHasUnfinishedTasks] = useState<boolean>(false);
  const { isLogin } = useGetLoginStatus();
  const getUnfinishedTasks = useCallback(async () => {
    try {
      const { dailyTasks, socialTasks, partnerTasks } = await fetchTasksList();
      if (dailyTasks.filter((item) => item.status !== 2).length > 0) {
        setHasUnfinishedTasks(true);
        return;
      }
      if (socialTasks.filter((item) => item.status !== 2).length > 0) {
        setHasUnfinishedTasks(true);
        return;
      }
      if (partnerTasks.filter((item) => item.status !== 2).length > 0) {
        setHasUnfinishedTasks(true);
        return;
      }
      setHasUnfinishedTasks(false);
      return;
    } catch (error) {
      setHasUnfinishedTasks(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!isLogin) return;
    getUnfinishedTasks();
  }, [getUnfinishedTasks, isLogin]);

  return {
    getUnfinishedTasks,
    hasUnfinishedTasks,
  };
}

export default useGetUnfinishedTasks;
