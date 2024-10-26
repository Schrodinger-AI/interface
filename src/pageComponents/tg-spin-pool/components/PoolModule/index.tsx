/* eslint-disable @next/next/no-img-element */
'use client';

import { Flex, List } from 'antd';
import clsx from 'clsx';
import React from 'react';
import SkeletonImage from 'components/SkeletonImage';

type IProps = {
  data: ISpinPrizesPoolItem[];
  row?: number;
  title: React.ReactNode;
  subTitle: React.ReactNode;
  className: string;
};

export default function PoolModule({ title, subTitle, data, row = 2, className }: IProps) {
  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        className={clsx('mb-[8px] px-[12px] py-[8px] h-[38px rounded-[8px]', className)}>
        {title}
        <p className="text-pixelsTextPurple text-[12px] font-bold">{subTitle}</p>
      </Flex>

      <List
        grid={{
          gutter: 15,
          xs: row,
          sm: row,
          md: row,
        }}
        dataSource={data || []}
        renderItem={(item) => (
          <List.Item>
            <SkeletonImage
              img={item.inscriptionImageUri}
              tag={`GEN ${item.generation}`}
              rarity={item.describe}
              imageSizeType="contain"
              className="!rounded-[8px]"
              imageClassName="!rounded-[8px]"
              tagPosition="small"
            />
          </List.Item>
        )}
      />
    </>
  );
}
