'use client';
import { message } from 'antd';
import useGetUnreadMessagesCount from 'hooks/useGetUnreadMessagesCount';
import { useInitData } from 'hooks/useInitData';
import useTelegram from 'hooks/useTelegram';
import useUpdateLoginStatus from 'hooks/useUpdateLoginStatus';
import useNavigationGuard from 'provider/useNavigationGuard';
import { useEffect } from 'react';
import { getHasNewActivities } from 'utils/getHasNewActivities';

const Updater = () => {
  useInitData();
  useNavigationGuard();
  useUpdateLoginStatus();
  useGetUnreadMessagesCount();

  const { isInTG } = useTelegram();

  useEffect(() => {
    if (isInTG) {
      message.config({
        prefixCls: 'dark-message',
      });
    }
  }, [isInTG]);

  useEffect(() => {
    getHasNewActivities();
  }, []);

  return null;
};

export default Updater;
