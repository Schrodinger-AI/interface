'use client';

import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import BalanceModule from '../tg-home/components/BalanceModule';
import FooterButtons from '../tg-home/components/FooterButtons';
import FloatingButton from '../tg-home/components/FloatingButton';
import { fetchTasksList } from 'api/request';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import Countdown from 'antd/es/statistic/Countdown';
import TaskModule from './components/TaskModule';
import styles from './index.module.css';
import useBalanceService from 'pageComponents/tg-home/hooks/useBalanceService';
import { ReactComponent as RefreshSVG } from 'assets/img/telegram/icon_refresh.svg';

export default function TgHome() {
  const [countdown, setCountdown] = useState(1000 * 60 * 60 * 24);
  const [dailyTasks, setDailyTasks] = useState<ITaskItem[]>([]);
  const [socialTasks, setSocialTasks] = useState<ITaskItem[]>([]);
  const [accomplishmentTasks, setAccomplishmentTasks] = useState<ITaskItem[]>([]);

  const { isLogin } = useGetLoginStatus();

  const { refresh } = useBalanceService();

  const getTaskList = async () => {
    try {
      const { countdown, dailyTasks, socialTasks, accomplishmentTasks } = await fetchTasksList();
      setCountdown(countdown || 0);
      setDailyTasks(dailyTasks || []);
      setSocialTasks(socialTasks || []);
      setAccomplishmentTasks(accomplishmentTasks || []);
    } catch (error) {
      /* empty */
    }
  };

  const deadline = useMemo(() => {
    return Date.now() + countdown * 1000;
  }, [countdown]);

  useEffect(() => {
    if (isLogin) {
      getTaskList();
    }
  }, [isLogin]);

  const handleUpdate = () => {
    refresh();
    getTaskList();
  };

  const onFinish = () => isLogin && getTaskList();

  return (
    <div className={clsx('flex flex-col max-w-[2560px] w-full min-h-screen px-4 py-6 pb-[112px]')}>
      <BalanceModule />
      <div className="relative mt-[2.7vh]">
        <div className="absolute top-[8px] right-0 z-20" onClick={getTaskList}>
          <RefreshSVG className="w-[24px] h-[24px]" />
        </div>
        <TaskModule
          title="Daily Tasks"
          subTitle={
            <p className="text-white text-[16px] font-semibold leading-[24px]">
              (<Countdown className={styles.countdown} value={deadline} onFinish={onFinish} />)
            </p>
          }
          tasks={dailyTasks}
          onUpdate={handleUpdate}
        />

        {socialTasks.length > 0 && <TaskModule title="Social Tasks" tasks={socialTasks} onUpdate={handleUpdate} />}

        {accomplishmentTasks.length > 0 && (
          <TaskModule title="New Tasks" tasks={accomplishmentTasks} onUpdate={handleUpdate} />
        )}
      </div>

      <FooterButtons />
      <FloatingButton />
    </div>
  );
}
