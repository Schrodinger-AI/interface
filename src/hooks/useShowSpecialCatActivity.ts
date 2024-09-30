import { useCallback, useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { useModal } from '@ebay/nice-modal-react';
import SpecialCatActivityTipsModal from 'components/SpecialCatActivityTipsModal';
import { sleep } from '@portkey/utils';
import BigNumber from 'bignumber.js';
import useTelegram from './useTelegram';
import { useWalletService } from './useWallet';

export const useShowSpecialCatActivity = () => {
  const cmsInfo = useCmsInfo();
  const { isInTG } = useTelegram();
  const { wallet } = useWalletService();
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

  const addressHash = useMemo(() => {
    return Buffer.from(wallet.address).toString('hex');
  }, [wallet.address]);

  const saveLoggedInAccounts = useCallback(
    (loggedInAccounts: string[]) => {
      const accounts = [...loggedInAccounts, addressHash];
      localStorage.setItem('specialCatActivityHash', JSON.stringify(accounts));
    },
    [addressHash],
  );

  const showSpecialCatActivity = useCallback(async () => {
    const showSpecialCatActivityStatus = localStorage.getItem('showSpecialCatActivityStatus');

    let loggedInAccounts = [];
    try {
      loggedInAccounts = JSON.parse(localStorage.getItem('specialCatActivityHash') || '');
    } catch (error) {
      /* empty */
    }

    const activityStartTime = String(cmsInfo?.specialCatActivity?.time?.[0]);

    if (isEnded) return;

    if (activityStartTime && !showSpecialCatActivityStatus) {
      saveLoggedInAccounts(loggedInAccounts);
      toShow(activityStartTime);
      return;
    }
    if (activityStartTime && showSpecialCatActivityStatus) {
      const addressHasShow = loggedInAccounts.includes(addressHash);
      if (addressHasShow && activityStartTime === showSpecialCatActivityStatus) {
        return;
      }
      if (!addressHasShow) saveLoggedInAccounts(loggedInAccounts);
      toShow(activityStartTime);
      return;
    }
  }, [addressHash, cmsInfo?.specialCatActivity?.time, isEnded, saveLoggedInAccounts, toShow]);

  return { showSpecialCatActivity };
};
