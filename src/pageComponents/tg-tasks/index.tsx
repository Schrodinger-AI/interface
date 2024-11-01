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
  const [countdown, setCountdown] = useState(0);
  const [dailyTasks, setDailyTasks] = useState<ITaskItem[]>([]);
  const [socialTasks, setSocialTasks] = useState<ITaskItem[]>([]);
  const [accomplishmentTasks, setAccomplishmentTasks] = useState<ITaskItem[]>([]);

  const { isLogin } = useGetLoginStatus();

  const { balanceData, refresh, updatePoints } = useBalanceService();

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

  const onDailyUpdate = (index: number, data: ITaskResponse) => {
    setDailyTasks((prevItems) => {
      const newItems = [...prevItems];
      if (index >= 0 && index < newItems.length) {
        newItems[index] = { ...newItems[index], status: data.status };
      }
      return newItems;
    });
    data?.fishScore && updatePoints(data.fishScore);
  };

  const onSocialUpdate = (index: number, data: ITaskResponse) => {
    setSocialTasks((prevItems) => {
      const newItems = [...prevItems];
      if (index >= 0 && index < newItems.length) {
        newItems[index] = { ...newItems[index], status: data.status };
      }
      return newItems;
    });
    data?.fishScore && updatePoints(data.fishScore);
  };

  const onNewUpdate = (index: number, data: ITaskResponse) => {
    setAccomplishmentTasks((prevItems) => {
      const newItems = [...prevItems];
      if (index >= 0 && index < newItems.length) {
        newItems[index] = { ...newItems[index], status: data.status, name: data.name };
      }
      return newItems;
    });
    data?.fishScore && updatePoints(data.fishScore);
  };

  const onFinish = () => isLogin && getTaskList();

  return (
    <div className={clsx('flex flex-col max-w-[2560px] w-full min-h-screen px-4 py-6 pb-[112px]')}>
      <BalanceModule balanceData={balanceData} />
      <div className="relative mt-[2.7vh]">
        <div className="absolute top-[8px] right-0 z-20" onClick={handleUpdate}>
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
          onUpdate={onDailyUpdate}
        />

        {socialTasks.length > 0 && <TaskModule title="Social Tasks" tasks={socialTasks} onUpdate={onSocialUpdate} />}

        {accomplishmentTasks.length > 0 && (
          <TaskModule title="Achievements" tasks={accomplishmentTasks} onUpdate={onNewUpdate} />
        )}
      </div>

      <FooterButtons />
      <FloatingButton />
    </div>
  );
}
