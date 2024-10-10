'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TSGRTokenInfo } from 'types/tokens';
import BalanceModule from '../tg-home/components/BalanceModule';
import FooterButtons from '../tg-home/components/FooterButtons';
import FloatingButton from '../tg-home/components/FloatingButton';
import { useWalletService } from 'hooks/useWallet';
import { fetchTasksList } from 'api/request';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import Countdown from 'antd/es/statistic/Countdown';
import TaskModule from './components/TaskModule';

export default function TgHome() {
  const [schrodingerDetail] = useState<TSGRTokenInfo>();
  const [, setSgrBalance] = useState('0');
  const [, setElfBalance] = useState('0');
  const [countdown, setCountdown] = useState(1000 * 60 * 60 * 24);
  const [dailyTasks, setDailyTasks] = useState<ITaskItem[]>([
    {
      taskId: 'aaa',
      name: 'login bot',
      status: 1,
    },
    {
      taskId: 'bbb',
      name: 'login botbot',
      status: 1,
    },
  ]);

  const { wallet } = useWalletService();
  const { isLogin } = useGetLoginStatus();

  const onBalanceChange = useCallback((value: string) => {
    value && setSgrBalance(value);
  }, []);
  const onElfBalanceChange = useCallback((value: string) => {
    value && setElfBalance(value);
  }, []);

  const getTaskList = async (address: string) => {
    try {
      const { countdown, dailyTasks } = await fetchTasksList({
        address,
      });
      setCountdown(countdown || 0);
      setDailyTasks(dailyTasks || []);
    } catch (error) {
      /* empty */
    }
  };

  const deadline = useMemo(() => {
    return Date.now() + countdown;
  }, [countdown]);

  useEffect(() => {
    if (wallet?.address) {
      getTaskList(wallet.address);
    }
  }, [wallet, isLogin]);

  const onFinish = () => wallet?.address && getTaskList(wallet?.address);

  return (
    <div className={clsx('flex flex-col max-w-[2560px] w-full min-h-screen px-4 py-6 pb-[112px]')}>
      <BalanceModule onSgrBalanceChange={onBalanceChange} onElfBalanceChange={onElfBalanceChange} />
      <div className="mt-[2.7vh]">
        <TaskModule
          title="Daily Tasks"
          subTitle={<Countdown value={deadline} onFinish={onFinish} />}
          tasks={dailyTasks}
        />
      </div>

      <FooterButtons cId={schrodingerDetail?.collectionId || ''} />
      <FloatingButton />
    </div>
  );
}
