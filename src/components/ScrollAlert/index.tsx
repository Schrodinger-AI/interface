import { MutedOutlined } from '@ant-design/icons';
import { Alert, Carousel } from 'antd';
import clsx from 'clsx';
import React from 'react';

export interface IScrollAlertItem {
  text: string;
  handle?: Function;
}

interface IProps {
  data: IScrollAlertItem[];
}

function ScrollAlert({ data }: IProps) {
  if (!data?.length) return null;

  return (
    <Alert
      className="w-full h-full"
      message={
        <div>
          <Carousel autoplay vertical dots={false}>
            {data.map((item, index) => {
              return (
                <p
                  key={index}
                  onClick={() => item?.handle && item.handle()}
                  className={clsx(
                    'text-sm lg:text-base text-neutralTitle font-medium',
                    item.handle ? 'cursor-pointer' : 'cursor-default',
                  )}>
                  {item.text}
                </p>
              );
            })}
          </Carousel>
        </div>
      }
      type="warning"
      icon={<MutedOutlined rev={undefined} className="text-[20px]" />}
      showIcon
    />
  );
}

export default React.memo(ScrollAlert);
