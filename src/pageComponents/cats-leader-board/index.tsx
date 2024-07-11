'use client';

import { getCatsRankList, getRankConfig } from 'api/request';
import clsx from 'clsx';
import { ICommonRadioTabButton } from 'components/CommonRadioTab';
import CustomTable from 'components/CustomTable';
import MobileBackNav from 'components/MobileBackNav';
import SkeletonImage from 'components/SkeletonImage';
import useResponsive from 'hooks/useResponsive';
import { renderDescription } from 'pageComponents/events-detail/components/EventsDetailsList';
import { IEventsDetailListTable, IRankConfigData, RankType } from 'pageComponents/events-detail/types/type';
import { useEffect, useMemo, useState } from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { useRouter, useSearchParams } from 'next/navigation';
import CommonSegmented from 'components/CommonSegmented';

const tab: ICommonRadioTabButton<RankType>[] = [
  {
    value: RankType.HOLDER,
    label: 'Holder Rank',
  },
  {
    value: RankType.COLLECTOR,
    label: 'Collector Rank',
  },
];

export default function CatsLeaderBoard() {
  const { isLG } = useResponsive();
  const searchParams = useSearchParams();
  const tabValue: RankType = useMemo(() => (searchParams.get('tab') as RankType) || RankType.HOLDER, [searchParams]);
  const [rankConfig, setRankConfig] = useState<IRankConfigData>();
  const [dataSource, setDataSource] = useState<IEventsDetailListTable['data']>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const getRankConfigInfo = async () => {
    try {
      const { data } = await getRankConfig();
      setRankConfig(data);
    } catch (error) {
      /* empty */
    }
  };

  const getCatsRankListInfo = async (server: string) => {
    try {
      if (server) {
        setLoading(true);
        const { items } = await getCatsRankList(server);
        setDataSource(items);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const server = rankConfig?.[tabValue].server;
    if (server) {
      getCatsRankListInfo(server);
    }
  }, [rankConfig, tabValue]);

  useEffectOnce(() => {
    getRankConfigInfo();
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px]">
        {isLG ? <MobileBackNav /> : null}

        {rankConfig?.banner ? (
          <div className={clsx('flex w-full h-auto mt-[8px] overflow-hidden mb-[24px]')}>
            <SkeletonImage
              img={isLG ? rankConfig.banner.mobile : rankConfig.banner.pc}
              className={clsx('w-full h-full')}
              imageClassName="!rounded-none"
            />
          </div>
        ) : null}

        <CommonSegmented
          options={tab}
          value={tabValue}
          onSegmentedChange={(value) => {
            router.replace(`/cats-leader-board?tab=${value}`);
          }}
          className="w-full lg:w-[310px]"
        />

        {rankConfig?.[tabValue].description ? (
          <div className="mt-[16px]">{renderDescription(rankConfig[tabValue].description)}</div>
        ) : null}
        {rankConfig?.[tabValue].header?.length || rankConfig?.[tabValue].server ? (
          <div className="mt-[16px]">
            <CustomTable header={rankConfig[tabValue].header} dataSource={dataSource} loading={loading} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
