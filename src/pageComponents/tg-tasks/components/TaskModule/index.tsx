import clsx from 'clsx';
import { Flex, List } from 'antd';
import React, { useMemo, useState } from 'react';
import { ReactComponent as TaskSVG } from 'assets/img/telegram/icon_Task.svg';
import { ReactComponent as FishSVG } from 'assets/img/telegram/tasks/icon_silver.svg';
import { ReactComponent as Finished } from 'assets/img/telegram/tasks/icon_finished.svg';
import throttle from 'lodash-es/throttle';
import { claimPoints, finishTask } from 'api/request';
import { Toast } from 'components/Toast';
import { useRouter } from 'next/navigation';

type IProps = {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  tasks: ITaskItem[];
  onUpdate?: (i: number, data: ITaskResponse) => void;
};

export default function AdoptModule({ title, subTitle, tasks, onUpdate }: IProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toClaimPoints = throttle(
    async (taskId, score, index) => {
      try {
        setLoading(true);
        const data = await claimPoints({ taskId });
        setLoading(false);
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
    async ({
      taskId,
      link,
      index,
      linkType,
    }: {
      taskId: string;
      link?: string;
      linkType?: TLinkType;
      index: number;
    }) => {
      if (link) {
        if (linkType === 'link') {
          router.push(link);
        } else {
          if (window?.Telegram?.WebApp?.openTelegramLink) {
            try {
              window?.Telegram?.WebApp?.openTelegramLink?.(link);
            } catch (error) {
              window.open(link, '_blank');
            }
          } else {
            window.open(link, '_blank');
          }
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

  const taskData = useMemo(
    () =>
      tasks.sort((a, b) => {
        if (a.status === 1) return -1;
        if (b.status === 1) return 1;
        return a.status - b.status;
      }),
    [tasks],
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
        dataSource={taskData}
        renderItem={(item, index) => (
          <List.Item
            className={clsx(
              'rounded-[8px] !px-[12px] mb-[8px]',
              item.status === 2 ? 'bg-pixelsBorder' : 'bg-pixelsDashPurple',
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
                disabled={loading}
                className="w-[64px] h-[30px] rounded-[8px] bg-white text-black border-0 text-[12px] font-bold"
                onClick={() => toClaimPoints(item.taskId, item.score, index)}>
                Claim
              </button>
            ) : (
              <button
                className="w-[64px] h-[30px] rounded-[8px] bg-pixelsdeepPurple text-white border-0 text-[12px] font-bold"
                onClick={() =>
                  handleLink({
                    taskId: item.taskId,
                    link: item.link,
                    linkType: item.linkType,
                    index,
                  })
                }>
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
