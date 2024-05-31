'use client';
import useGetUnreadMessagesCount from 'hooks/useGetUnreadMessagesCount';
import { useInitData } from 'hooks/useInitData';
import useUpdateLoginStatus from 'hooks/useUpdateLoginStatus';
import useNavigationGuard from 'provider/useNavigationGuard';
import { useEffect } from 'react';
import { getHasNewActivities } from 'utils/getHasNewActivities';

const Updater = () => {
  useInitData();
  useNavigationGuard();
  useUpdateLoginStatus();
  useGetUnreadMessagesCount();

  useEffect(() => {
    getHasNewActivities();
  }, []);

  return null;
};

export default Updater;
