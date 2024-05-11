'use client';
import useGetUnreadMessagesCount from 'hooks/useGetUnreadMessagesCount';
import { useInitData } from 'hooks/useInitData';
import useUpdateLoginStatus from 'hooks/useUpdateLoginStatus';
import useNavigationGuard from 'provider/useNavigationGuard';

const Updater = () => {
  useInitData();
  useNavigationGuard();
  useUpdateLoginStatus();
  useGetUnreadMessagesCount();
  return null;
};

export default Updater;
