'use client';
import useGetUnreadMessagesCount from 'hooks/useGetUnreadMessagesCount';
import { useInitData } from 'hooks/useInitData';
import useUpdateLoginStatus from 'hooks/useUpdateLoginStatus';
import useNavigationGuard from 'provider/useNavigationGuard';
import { getHasNewActivities } from 'utils/getHasNewActivities';

const Updater = () => {
  useInitData();
  useNavigationGuard();
  useUpdateLoginStatus();
  useGetUnreadMessagesCount();
  getHasNewActivities();
  return null;
};

export default Updater;
