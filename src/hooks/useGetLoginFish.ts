import { sleep } from '@portkey/utils';
import { claimPoints, fetchTasksList } from 'api/request';
import { useRouter } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';

export default function useGetLoginFish() {
  const router = useRouter();
  const cmsInfo = useCmsInfo();

  const claim = async () => {
    try {
      const taskList = await fetchTasksList();
      const loginTaskInfo = taskList?.dailyTasks.filter((item) => item.taskId === 'login')[0];
      if (loginTaskInfo.status === 1) {
        await sleep(cmsInfo?.taskClaimInterval || 500);
        await claimPoints({
          taskId: 'login',
        });
        return true;
      } else if (loginTaskInfo.status === 2) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const getLoginFish = async () => {
    const isClaim = await claim();
    if (isClaim) {
      await sleep(cmsInfo?.taskClaimInterval || 500);
      router.push('/telegram/lucky-spin');
    }
  };

  return {
    getLoginFish,
  };
}
