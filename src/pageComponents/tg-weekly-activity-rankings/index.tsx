'use client';

import { fetchActivityBotRank } from 'api/request';
import clsx from 'clsx';
import { ICommonRadioTabButton } from 'components/CommonRadioTab';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CommonSegmented from 'components/CommonSegmented';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import styles from './style.module.css';
import CommonTabs from 'components/CommonTabs';
import { TabsProps } from 'antd';
import { TgWeeklyActivityRankTime, TgWeeklyActivityRankType } from './types/type';
import RankList from './components/RankList';
import useLoading from 'hooks/useLoading';
import { useWalletService } from 'hooks/useWallet';
import TableEmpty from 'components/TableEmpty';

const tabsType: TabsProps['items'] = [
  {
    key: `${TgWeeklyActivityRankType.ADOPT}`,
    label: 'Cat Adoption',
  },
  {
    key: `${TgWeeklyActivityRankType.TRADE}`,
    label: 'NFT Trading',
  },
];

const tabsTime: ICommonRadioTabButton<TgWeeklyActivityRankTime>[] = [
  {
    value: TgWeeklyActivityRankTime.lastWeek,
    label: 'Last Week',
  },
  {
    value: TgWeeklyActivityRankTime.thisWeek,
    label: 'Current Week',
  },
];

export default function TgWeeklyActivityRankings() {
  const searchParams = useSearchParams();
  const tabTypeValue: TgWeeklyActivityRankType = useMemo(
    () => (Number(searchParams.get('type')) as TgWeeklyActivityRankType) || TgWeeklyActivityRankType.ADOPT,
    [searchParams],
  );
  const tabTimeValue: TgWeeklyActivityRankTime = useMemo(
    () => (searchParams.get('time') as TgWeeklyActivityRankTime) || TgWeeklyActivityRankTime.thisWeek,
    [searchParams],
  );

  const { wallet } = useWalletService();

  const { showLoading, closeLoading, visible } = useLoading();

  const [dataSource, setDataSource] = useState<IActivityBotRankData['data']>([]);
  const [myData, setMyData] = useState<IActivityBotRankDataItem>();

  const router = useRouter();

  const getActivityBotRank = useCallback(
    async (tabTypeValue: TgWeeklyActivityRankType, tabTimeValue: TgWeeklyActivityRankTime) => {
      try {
        showLoading();
        setDataSource([]);
        const { data, myRank, myReward, myScore } = await fetchActivityBotRank({
          tab: tabTypeValue,
          address: wallet.address,
          isCurrent: tabTimeValue === TgWeeklyActivityRankTime.lastWeek ? false : true,
        });

        setDataSource(data || []);

        if (data) {
          setMyData({
            address: wallet.address,
            scores: myScore ? String(myScore) : '',
            reward: myReward ? String(myReward) : '',
            rank: myRank,
          });
        } else {
          setMyData(undefined);
        }
      } finally {
        closeLoading();
      }
    },
    [closeLoading, showLoading, wallet.address],
  );

  const onTabsChange = ({ type, time }: { type: TgWeeklyActivityRankType; time: TgWeeklyActivityRankTime }) => {
    router.replace(`/tg-weekly-activity-rankings/?type=${type}&time=${time}`);
  };

  const pointsTitle = useMemo(() => {
    if (tabTimeValue === TgWeeklyActivityRankTime.lastWeek) {
      return '';
    } else {
      if (tabTypeValue === TgWeeklyActivityRankType.ADOPT) {
        return 'XPSGR-5';
      } else {
        return 'Trading Scores';
      }
    }
  }, [tabTimeValue, tabTypeValue]);

  useEffect(() => {
    getActivityBotRank(tabTypeValue, tabTimeValue);
  }, [tabTypeValue, tabTimeValue, getActivityBotRank, wallet.address]);

  return (
    <div className={clsx(styles['tg-weekly-activity-rankings-wrap'])}>
      <BackCom
        theme="dark"
        title="Weekly Leaderboard"
        className="w-full"
        tips={{
          show: true,
          link: '/tg-weekly-activity-rules',
        }}
      />

      <CommonTabs
        options={tabsType}
        activeKey={`${tabTypeValue}`}
        onTabsChange={(value) =>
          onTabsChange({
            type: Number(value) as TgWeeklyActivityRankType,
            time: tabTimeValue,
          })
        }
        theme="dark"
        className={clsx('my-[16px] w-full', styles['rankings-type'])}
      />

      <div className="flex w-full justify-center items-center">
        <CommonSegmented
          options={tabsTime}
          value={tabTimeValue}
          onSegmentedChange={(value) =>
            onTabsChange({
              type: tabTypeValue,
              time: value as TgWeeklyActivityRankTime,
            })
          }
          theme="dark"
          className="!w-[240px]"
        />
      </div>

      <div className="mt-[16px]">
        {dataSource?.map((item, index) => {
          return (
            <RankList key={index} index={`${index + 1}`} value={item} type={tabTimeValue} pointsTitle={pointsTitle} />
          );
        })}
      </div>

      {!dataSource.length && !visible ? <TableEmpty theme="dark" description="No data yet." /> : null}

      {myData && wallet.address && dataSource.length ? (
        <div className="fixed bottom-0 left-0 w-full px-[16px] bg-pixelsCardBg">
          <RankList
            theme="blue"
            index={myData?.rank ? `${myData?.rank}` : '> 20'}
            value={myData}
            type={tabTimeValue}
            pointsTitle={pointsTitle}
            isMine={true}
          />
        </div>
      ) : null}
    </div>
  );
}
