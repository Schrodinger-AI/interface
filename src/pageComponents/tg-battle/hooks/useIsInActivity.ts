import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';

export default function useIsInActivity() {
  const cmsInfo = useCmsInfo();

  const isInActivity = useMemo(() => {
    const startTime = cmsInfo?.voteActivityStartTime;
    const endTime = cmsInfo?.voteActivityEndTime;
    const now = new Date().getTime();

    if (startTime && BigNumber(now).gte(startTime) && endTime && BigNumber(endTime).gte(now)) {
      return true;
    } else {
      return false;
    }
  }, [cmsInfo?.voteActivityEndTime, cmsInfo?.voteActivityStartTime]);

  return isInActivity;
}
