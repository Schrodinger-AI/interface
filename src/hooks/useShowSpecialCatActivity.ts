import { useCallback, useEffect, useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { useModal } from '@ebay/nice-modal-react';
import SpecialCatActivityTipsModal from 'components/SpecialCatActivityTipsModal';
import { sleep } from '@portkey/utils';
import BigNumber from 'bignumber.js';
import useTelegram from './useTelegram';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export const useShowSpecialCatActivity = () => {
  const cmsInfo = useCmsInfo();
  const { isInTG } = useTelegram();
  const { walletInfo } = useConnectWallet();
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

  const notStarted = useMemo(() => {
    const now = new Date().getTime();
    const activityStartTime = String(cmsInfo?.specialCatActivity?.time?.[0]);
    if (!activityStartTime || BigNumber(activityStartTime).gt(BigNumber(now))) return true;
    return false;
  }, [cmsInfo?.specialCatActivity]);

  const getAddressHash = (address?: string) => {
    if (!address) return;
    const hash = Buffer.from(address).toString('hex');
    return hash;
  };

  const saveLoggedInAccounts = useCallback(
    (loggedInAccounts: string[]) => {
      const addressHash = getAddressHash(walletInfo?.address);
      if (addressHash) {
        const accounts = [...loggedInAccounts, addressHash];
        localStorage.setItem('specialCatActivityHash', JSON.stringify(accounts));
      }
    },
    [walletInfo?.address],
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

    if (isEnded || notStarted) return;
    const addressHash = getAddressHash(walletInfo?.address);
    const addressHasShow = loggedInAccounts.includes(addressHash);
    if (activityStartTime && !showSpecialCatActivityStatus) {
      if (!addressHasShow) saveLoggedInAccounts(loggedInAccounts);
      toShow(activityStartTime);
      return;
    }
    if (activityStartTime && showSpecialCatActivityStatus) {
      if (addressHasShow && activityStartTime === showSpecialCatActivityStatus) {
        return;
      }
      if (!addressHasShow) saveLoggedInAccounts(loggedInAccounts);
      toShow(activityStartTime);
      return;
    }
  }, [walletInfo?.address, cmsInfo?.specialCatActivity?.time, isEnded, notStarted, saveLoggedInAccounts, toShow]);

  return { showSpecialCatActivity };
};
