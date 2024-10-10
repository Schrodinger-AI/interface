import { Button, Flex, List } from 'antd';
import React from 'react';
import { ReactComponent as TaskSVG } from 'assets/img/telegram/icon_Task.svg';

type IProps = {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  tasks: ITaskItem[];
};

export default function AdoptModule({ title, subTitle, tasks }: IProps) {
  return (
    <div className="relative">
      <Flex align="center" justify="center" className="mb-2">
        {title}
        {subTitle}
      </Flex>
      <List
        split={false}
        dataSource={tasks}
        renderItem={(item) => (
          <List.Item className="bg-pixelsDashPurple rounded-[8px] !px-[12px]" key={item.taskId}>
            <List.Item.Meta
              avatar={<TaskSVG />}
              title={<span className="text-white">{item.name}</span>}
              description={<span className="text-white">{item.name}</span>}
            />
            <Button type="primary" size="small" className="ml-2">
              Go
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
}
