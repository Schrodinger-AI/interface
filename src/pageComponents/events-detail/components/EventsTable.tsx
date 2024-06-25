/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useState } from 'react';
import { IEventsDetailListTable } from '../types/type';
import { getEventRankList } from 'api/request';
import CustomTable from 'components/CustomTable';

function EventsTable({
  header: th,
  data,
  server,
  isFinal = false,
}: IEventsDetailListTable & {
  isFinal?: boolean;
}) {
  const [header, setHeader] = useState<IEventsDetailListTable['header']>(server ? [] : th);
  const [dataSource, setDataSource] = useState<IEventsDetailListTable['data']>(server ? [] : data);
  const [loading, setLoading] = useState<boolean>(server ? true : false);

  const getTableDataSource = useCallback(
    async (server: string) => {
      try {
        setLoading(true);
        const { header, data } = await getEventRankList(server, {
          isFinal,
        });

        setHeader(header);
        setDataSource(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [isFinal],
  );

  useEffect(() => {
    if (server) {
      getTableDataSource(server);
    }
  }, [getTableDataSource, server]);

  return <CustomTable header={header} dataSource={dataSource} loading={loading} />;
}

export default React.memo(EventsTable);
