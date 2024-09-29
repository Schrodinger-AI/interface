import { useCallback, useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { useModal } from '@ebay/nice-modal-react';
import SpecialCatActivityTipsModal from 'components/SpecialCatActivityTipsModal';
import { sleep } from '@portkey/utils';
import BigNumber from 'bignumber.js';
import useTelegram from './useTelegram';

export const useShowSpecialCatActivity = () => {
  const cmsInfo = useCmsInfo();
  const { isInTG } = useTelegram();
  const specialCatActivityTipsModal = useModal(SpecialCatActivityTipsModal);

  const toShow = useCallback(
    async (activityStartTime: string) => {
      await sleep(500);
      localStorage.setItem('showSpecialCatActivityStatus', activityStartTime);
      specialCatActivityTipsModal.show({
        theme: isInTG ? 'dark' : 'light',
      });
    },
    [specialCatActivityTipsModal, isInTG],
  );

  const isEnded = useMemo(() => {
    const now = new Date().getTime();
    const activityEndTime = String(cmsInfo?.specialCatActivity?.time?.[1]);
    if (!activityEndTime || BigNumber(now).gt(BigNumber(activityEndTime))) return true;
    return false;
  }, [cmsInfo?.specialCatActivity]);

  const showSpecialCatActivity = useCallback(async () => {
    const showSpecialCatActivityStatus = localStorage.getItem('showSpecialCatActivityStatus');
    const activityStartTime = String(cmsInfo?.specialCatActivity?.time?.[0]);

    if (isEnded) return;

    if (activityStartTime && !showSpecialCatActivityStatus) {
      toShow(activityStartTime);
      return;
    }
    if (activityStartTime && showSpecialCatActivityStatus && activityStartTime !== showSpecialCatActivityStatus) {
      toShow(activityStartTime);
      return;
    }
  }, [cmsInfo?.specialCatActivity, isEnded, toShow]);

  return { showSpecialCatActivity };
};
