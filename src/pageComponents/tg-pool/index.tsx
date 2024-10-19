/* eslint-disable @next/next/no-img-element */
'use client';

import { Flex, List } from 'antd';
import { catsListAll } from 'api/request';
import clsx from 'clsx';
import SkeletonImage from 'components/SkeletonImage';
import TgCollapse from 'components/TgCollapse';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import { ReactComponent as NoDataBlue } from 'assets/img/telegram/pool/no-data-blue.svg';
import { ReactComponent as NoDataRed } from 'assets/img/telegram/pool/no-data-red.svg';
import { useCallback, useEffect, useState } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { ICatsListData } from 'types/tokens';
import styles from './index.module.css';

export default function TgHome() {
  const [trumpData, setTrumpData] = useState<ICatsListData>();
  const [harrisData, setHarrisData] = useState<ICatsListData>();
  const cmsInfo = useCmsInfo();
  const curChain = cmsInfo?.curChain || '';
  const trumpTraits = cmsInfo?.trumpTraits;
  const harrisTraits = cmsInfo?.harrisTraits;
  const prevSide = cmsInfo?.prevSide;
  const nextSide = cmsInfo?.nextSide;

  const getDataSource = useCallback(
    async (defaultRequestParams: ICatsListParams) => {
      if (!trumpTraits?.length && !harrisTraits?.length) return;
      try {
        const [trumpRes, harisRes] = await Promise.all([
          catsListAll({ ...defaultRequestParams, generations: [9], traits: trumpTraits }),
          catsListAll({ ...defaultRequestParams, generations: [9], traits: harrisTraits }),
        ]);
        setTrumpData(trumpRes);
        setHarrisData(harisRes);
      } catch (error) {
        /* empty */
      }
    },
    [harrisTraits, trumpTraits],
  );

  useEffect(() => {
    getDataSource({
      chainId: curChain,
      maxResultCount: 500,
      skipCount: 0,
    });
  }, [curChain, getDataSource]);

  return (
    <div className={clsx('max-w-[2560px] w-full min-h-screen p-[16px] bg-battaleBg')}>
      <BackCom className="w-full" theme="dark" />
      <h4 className="leading-[24px] text-[16px] font-black text-pixelsWhiteBg mt-[16px] mb-[24px]">Reward Cat Pool</h4>
      <TgCollapse
        items={[
          {
            key: 'Harris',
            label: (
              <Flex align="center" justify="space-between">
                <p className="font-black text-[14px] leading-[22px] text-pixelsWhiteBg">{nextSide}</p>
                <p className="font-bold text-[14px] leading-[22px] text-pixelsWhiteBg">{harrisData?.totalCount || 0}</p>
              </Flex>
            ),
            children: (
              <List
                grid={{
                  gutter: 9,
                  xs: 4,
                  sm: 4,
                  md: 4,
                }}
                locale={{
                  emptyText: (
                    <div className="w-full flex justify-center items-center">
                      <NoDataBlue />
                    </div>
                  ),
                }}
                className={styles.poolList}
                dataSource={harrisData?.data || []}
                renderItem={(item) => (
                  <List.Item>
                    <SkeletonImage
                      img={item.inscriptionImageUri}
                      imageSizeType="contain"
                      className="!rounded-[4px] border-[3px] border-solid border-pixelsWhiteBg shadow-btnShadow"
                      imageClassName="!rounded-[4px]"
                      rarity={item.describe}
                      tagPosition="small"
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'Trump',
            label: (
              <Flex align="center" justify="space-between">
                <p className="font-black text-[14px] leading-[22px] text-pixelsWhiteBg">{prevSide}</p>
                <p className="font-bold text-[14px] leading-[22px] text-pixelsWhiteBg">{trumpData?.totalCount || 0}</p>
              </Flex>
            ),
            children: (
              <List
                grid={{
                  gutter: 9,
                  xs: 4,
                  sm: 4,
                  md: 4,
                }}
                locale={{
                  emptyText: (
                    <div className="w-full flex justify-center items-center">
                      <NoDataRed />
                    </div>
                  ),
                }}
                className={styles.poolList}
                dataSource={trumpData?.data || []}
                renderItem={(item) => (
                  <List.Item>
                    <SkeletonImage
                      img={item.inscriptionImageUri}
                      imageSizeType="contain"
                      className="!rounded-[4px] border-[3px] border-solid border-pixelsWhiteBg shadow-btnShadow"
                      imageClassName="!rounded-[4px]"
                      rarity={item.describe}
                      tagPosition="small"
                    />
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
