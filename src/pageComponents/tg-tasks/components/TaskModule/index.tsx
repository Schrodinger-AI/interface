import clsx from 'clsx';
import { Flex, List } from 'antd';
import React, { useState } from 'react';
import { ReactComponent as TaskSVG } from 'assets/img/telegram/icon_Task.svg';
import { ReactComponent as FishSVG } from 'assets/img/telegram/tasks/icon_silver.svg';
import { ReactComponent as Finished } from 'assets/img/telegram/tasks/icon_finished.svg';
import throttle from 'lodash-es/throttle';
import { claimPoints, finishTask } from 'api/request';
import { Toast } from 'components/Toast';

type IProps = {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  tasks: ITaskItem[];
  onUpdate?: (i: number, data: ITaskResponse) => void;
};

export default function AdoptModule({ title, subTitle, tasks, onUpdate }: IProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const toClaimPoints = throttle(
    async (taskId, score, index) => {
      try {
        const data = await claimPoints({ taskId });
        const { status } = data;
        if (status === 2) {
          setMessage(`You got ${score} $fish`);
          setVisible(true);
          onUpdate?.(index, data);
        }
      } catch (error) {
        /* empty */
      }
    },
    700,
    { trailing: false },
  );

  const handleLink = throttle(
    async (taskId, link, index) => {
      if (link) {
        console.log('====handleLink');
        if (window?.Telegram?.WebApp?.openTelegramLink) {
          console.log('====handleLink openTelegramLink');
          window?.Telegram?.WebApp?.openTelegramLink(link);
        } else {
          console.log('====handleLink window');
          window.open(link, '_blank');
        }
      }
      try {
        const data = await finishTask({ taskId });
        const { status } = data;
        if (status === 1) {
          onUpdate?.(index, data);
        }
      } catch (error) {
        /* empty */
      }
    },
    700,
    { trailing: false },
  );

  return (
    <div className="relative mt-[8px]">
      <Flex align="center" justify="start" className="mb-2" gap={8}>
        <p className="relative text-white font-black text-[16px] leading-[24px]">
          {title}

          {tasks.filter((item) => item.status !== 2).length > 0 && (
            <span className="absolute top-[1px] right-[-5px] w-[6px] h-[6px] rounded-[50%] bg-pixelsButtonSuccess"></span>
          )}
        </p>
        {subTitle}
      </Flex>
      <List
        split={false}
        dataSource={tasks.sort((a, b) => {
          if (a.status === 1) return -1;
          if (b.status === 1) return 1;
          return a.status - b.status;
        })}
        renderItem={(item, index) => (
          <List.Item
            className={clsx(
              item.status === 2 ? 'bg-pixelsBorder' : 'bg-pixelsDashPurple',
              'bg-pixelsDashPurple rounded-[8px] !px-[12px] mb-[8px]',
            )}
            key={item.taskId}>
            <List.Item.Meta
              avatar={<TaskSVG />}
              title={<span className="text-white text-[12px] font-bold">{item.name}</span>}
              description={
                <Flex align="center" gap={4}>
                  <FishSVG className="w-[16px] h-[16px]" />
                  <span className="text-white font-semibold text-[10px]">+ {item.score} Fish</span>
                </Flex>
              }
            />

            {item.status === 2 ? (
              <Flex align="center" justify="center" className="w-[64px] h-[30px]">
                <Finished />
              </Flex>
            ) : item.status === 1 ? (
              <button
                className="w-[64px] h-[30px] rounded-[8px] bg-white text-black border-0 text-[12px] font-bold"
                onClick={() => toClaimPoints(item.taskId, item.score, index)}>
                Claim
              </button>
            ) : (
              <button
                className="w-[64px] h-[30px] rounded-[8px] bg-pixelsdeepPurple text-white border-0 text-[12px] font-bold"
                onClick={() => handleLink(item.taskId, item.link, index)}>
                Go
              </button>
            )}
          </List.Item>
        )}
      />

      <Toast visible={visible} message={message} onClose={() => setVisible(false)} />
    </div>
  );
}
