/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IEventsDetailListTable } from '../types/type';
import { getEventRankList } from 'api/request';
import CustomTable, { ICustomTableProps } from 'components/CustomTable';
import { useParams } from 'next/navigation';
import { useWalletService } from 'hooks/useWallet';
import { formatTokenPrice } from 'utils/format';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

function EventsTable({
  header: th,
  data,
  server,
  isFinal = false,
  params = {},
}: IEventsDetailListTable & {
  isFinal?: boolean;
}) {
  const [header, setHeader] = useState<IEventsDetailListTable['header']>(server ? [] : th);
  const [dataSource, setDataSource] = useState<IEventsDetailListTable['data']>(server ? [] : data);
  const [loading, setLoading] = useState<boolean>(server ? true : false);
  const [myData, setMyData] = useState<ICustomTableProps['myData']>();
  const { wallet } = useWalletService();
  const { isLogin } = useGetLoginStatus();

  const address = useMemo(() => (isLogin && wallet.address ? wallet.address : undefined), [isLogin, wallet.address]);

  const { id } = useParams() as {
    id: string;
  };

  const getTableDataSource = useCallback(
    async (server: string) => {
      try {
        setLoading(true);
        const { header, data, myRank, myReward, myScore } = await getEventRankList(server, {
          isFinal,
          activityId: id,
          address,
          ...params,
        });

        setHeader(header);
        setDataSource(data);

        if (address && data) {
          let currentShowValue = '-';
          if (params.isCurrent) {
            currentShowValue = myScore
              ? formatTokenPrice(myScore, {
                  decimalPlaces: 1,
                })
              : '-';
          } else {
            currentShowValue = myReward ? `${myReward} SGR` : '-';
          }
          setMyData({
            rank: `${myRank ? myRank : '> 20'}`,
            address: wallet.address,
            value: currentShowValue,
          });
        } else {
          setMyData(undefined);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [address, id, isFinal, params, wallet.address],
  );

  useEffect(() => {
    if (server) {
      getTableDataSource(server);
    }
  }, [getTableDataSource, server]);

  return <CustomTable header={header} dataSource={dataSource} loading={loading} myData={myData} numberDecimal={1} />;
}

export default React.memo(EventsTable);
