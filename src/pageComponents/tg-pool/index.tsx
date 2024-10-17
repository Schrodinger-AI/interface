/* eslint-disable @next/next/no-img-element */
'use client';

import { Flex, List } from 'antd';
import { catsListAll } from 'api/request';
import clsx from 'clsx';
import TgCollapse from 'components/TgCollapse';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { ICatsListData } from 'types/tokens';
import { getDefaultFilter, getFilter } from 'types/tokensPage';
import { ListTypeEnum } from 'types';
import { useSearchParams } from 'next/navigation';

export default function TgHome() {
  const [trumpData, setTrumpData] = useState<ICatsListData>();
  const [harrisData, setHarrisData] = useState<ICatsListData>();
  const cmsInfo = useCmsInfo();
  const curChain = cmsInfo?.curChain || '';
  const searchParams = useSearchParams();
  const pageState: ListTypeEnum = useMemo(
    () => (Number(searchParams.get('pageState')) as ListTypeEnum) || ListTypeEnum.RARE,
    [searchParams],
  );

  const defaultFilter = useMemo(
    () =>
      getDefaultFilter(curChain, {
        needRare: pageState === ListTypeEnum.RARE,
        rarityFilterItems: cmsInfo?.rarityFilterItems,
      }),
    [cmsInfo?.rarityFilterItems, curChain, pageState],
  );

  const defaultRequestParams = useMemo(() => {
    const filter = getFilter(defaultFilter);
    return {
      ...filter,
      skipCount: 0,
      maxResultCount: 500,
    };
  }, [defaultFilter]);

  const getDataSource = useCallback(async (defaultRequestParams: ICatsListParams) => {
    try {
      const [trumpRes, harisRes] = await Promise.all([
        catsListAll({ ...defaultRequestParams }),
        catsListAll({ ...defaultRequestParams }),
      ]);
      setTrumpData(trumpRes);
      setHarrisData(harisRes);
    } catch (error) {
      /* empty */
    }
  }, []);

  useEffect(() => {
    getDataSource(defaultRequestParams);
  }, [getDataSource]);

  return (
    <div className={clsx('max-w-[2560px] w-full min-h-screen px-4 py-6 bg-battaleBg')}>
      <TgCollapse
        items={[
          {
            key: 'Harris',
            label: (
              <Flex align="center" justify="space-between">
                <p className="font-black text-[14px] leading-[22px] text-pixelsWhiteBg">Harris</p>
                <p className="font-bold text-[14px] leading-[22px] text-pixelsWhiteBg">{harrisData?.totalCount || 0}</p>
              </Flex>
            ),
            children: (
              <List
                grid={{
                  gutter: 16,
                  md: 4,
                }}
                dataSource={harrisData?.data || []}
                renderItem={(item) => (
                  <List.Item>
                    <img src={item.adopter} alt={item.adopter} />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'Trump',
            label: (
              <Flex align="center" justify="space-between">
                <p className="font-black text-[14px] leading-[22px] text-pixelsWhiteBg">Trump</p>
                <p className="font-bold text-[14px] leading-[22px] text-pixelsWhiteBg">{trumpData?.totalCount || 0}</p>
              </Flex>
            ),
            children: (
              <List
                grid={{
                  gutter: 16,
                  md: 4,
                }}
                dataSource={trumpData?.data || []}
                renderItem={(item) => (
                  <List.Item>
                    <img src={item.adopter} alt={item.adopter} />
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
