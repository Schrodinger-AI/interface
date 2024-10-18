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
import TableEmpty from 'components/TableEmpty';
import trophies from 'assets/img/telegram/rank/trophies.png';
import Image from 'next/image';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

// TODO: To be updated on subsequent activities
// const tabsType: TabsProps['items'] = [
//   {
//     key: `${TgWeeklyActivityRankType.ADOPT}`,
//     label: 'Cat Adoption',
//   },
//   {
//     key: `${TgWeeklyActivityRankType.TRADE}`,
//     label: 'NFT Trading',
//   },
// ];

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

  const { walletInfo } = useConnectWallet();

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
          address: walletInfo?.address || '',
          isCurrent: tabTimeValue === TgWeeklyActivityRankTime.lastWeek ? false : true,
        });

        setDataSource(data || []);

        if (data) {
          setMyData({
            address: walletInfo?.address || '',
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
    [closeLoading, showLoading, walletInfo?.address],
  );

  const onTabsChange = ({ type, time }: { type: TgWeeklyActivityRankType; time: TgWeeklyActivityRankTime }) => {
    router.replace(`/tg-weekly-activity-rankings/?type=${type}&time=${time}`);
  };

  useEffect(() => {
    getActivityBotRank(tabTypeValue, tabTimeValue);
  }, [tabTypeValue, tabTimeValue, getActivityBotRank, walletInfo?.address]);

  return (
    <div className={clsx(styles['tg-weekly-activity-rankings-wrap'])}>
      <div className={clsx(styles['rankings-bg'])} />
      <BackCom
        theme="dark"
        title="Cat Adoption"
        className="relative z-10 w-full px-4"
        tips={{
          show: true,
          link: '/tg-weekly-activity-rules',
        }}
      />

      {/* TODO: To be updated on subsequent activities */}
      {/* <CommonTabs
        options={tabsType}
        activeKey={`${tabTypeValue}`}
        onTabsChange={(value) =>
          onTabsChange({
            type: Number(value) as TgWeeklyActivityRankType,
            time: tabTimeValue,
          })
        }
        theme="dark"
        className={clsx('relative z-10 my-[16px] w-full px-4 !h-[38px]', styles['rankings-type'])}
      /> */}

      <div className="relative z-10 flex w-full justify-center items-center mt-[16px]">
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
          segmentedSize="middle"
          className={clsx('!w-[240px] !h-[38px]', styles['rankings-time'])}
        />
      </div>

      <div className="w-full h-[102px] flex justify-center items-start mt-[16px] relative z-10 ">
        <Image src={trophies} alt="" width={686} height={308} className="w-[343px] h-[154px] shrink-0" />
      </div>

      <div className={clsx(styles['rank-list-wrap'])}>
        <div className={clsx(styles['rank-list-card'])}>
          <div
            className={clsx(
              'relative p-4 pb-[80px] min-h-full',
              !dataSource.length && 'flex justify-center items-center',
            )}>
            <div className={clsx(styles['rank-list-card-blur'])} />
            <div className="relative z-20">
              {dataSource?.map((item, index) => {
                return (
                  <RankList
                    key={index}
                    index={`${index + 1}`}
                    value={item}
                    type={tabTimeValue}
                    isMine={item.address === walletInfo?.address}
                  />
                );
              })}
            </div>

            {!dataSource.length && !visible ? <TableEmpty theme="transparent" description="No data yet." /> : null}
          </div>
        </div>
      </div>

      {myData && walletInfo?.address && dataSource.length ? (
        <div className="fixed bottom-0 h-[70px] left-0 w-full px-[10px] bg-pixelsCardBg z-20 flex items-center">
          <RankList
            index={myData?.rank ? `${myData?.rank}` : '-'}
            value={myData}
            type={tabTimeValue}
            isMine={true}
            bottom={true}
          />
        </div>
      ) : null}
    </div>
  );
}
