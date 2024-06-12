/* eslint-disable react/no-unescaped-entities */
import { Table, ToolTip } from 'aelf-design';
import { TableColumnsType } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './style.module.css';
import clsx from 'clsx';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import CommonCopy from 'components/CommonCopy';
import { useResponsive } from 'hooks/useResponsive';
import { formatTokenPrice } from 'utils/format';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { IEventsDetailListTable } from '../types/type';
import Loading from 'components/Loading';
import { getEventRankList } from 'api/request';

const renderCell = (value: string) => {
  return <span className="text-neutralTitle font-medium text-sm">{value}</span>;
};

const renderTitle = (value: string, tooltip?: string[]) => {
  return (
    <div className="flex items-center">
      {tooltip && tooltip.length ? (
        <ToolTip
          title={
            <div>
              {tooltip.map((item, index) => {
                return <p key={index}>{item}</p>;
              })}
            </div>
          }
          className="mr-[4px]">
          <Question className="fill-neutralDisable" />
        </ToolTip>
      ) : null}

      <span className="text-sm text-neutralDisable font-medium">{value}</span>
    </div>
  );
};

function EventsTable({
  header: th,
  data,
  server,
  isFinal = false,
}: IEventsDetailListTable & {
  isFinal?: boolean;
}) {
  const { isLG } = useResponsive();
  const [header, setHeader] = useState<IEventsDetailListTable['header']>(server ? [] : th);
  const [dataSource, setDataSource] = useState<IEventsDetailListTable['data']>(server ? [] : data);
  const [loading, setLoading] = useState<boolean>(server ? true : false);

  const renderAddress = useCallback(
    (address: string) => {
      return (
        <CommonCopy toCopy={addPrefixSuffix(address)}>
          {isLG ? (
            renderCell(getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS))
          ) : (
            <ToolTip trigger={'hover'} title={addPrefixSuffix(address)}>
              {renderCell(getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS))}
            </ToolTip>
          )}
        </CommonCopy>
      );
    },
    [isLG],
  );

  const columns: TableColumnsType<any> = useMemo(() => {
    if (header?.length) {
      return header.map((item) => {
        return {
          title: renderTitle(item.title, item.tooltip),
          dataIndex: item.key,
          key: item.key,
          width: item.width,
          render: (value, _record, index) => {
            switch (item.type) {
              case 'address':
                if (!value || value === '-') return '-';
                return renderAddress(value);
              case 'number':
                return renderCell(formatTokenPrice(value));
              default:
                return renderCell(item.key === 'index' ? `${index + 1}` : value);
            }
          },
        };
      });
    } else {
      return [];
    }
  }, [header, renderAddress]);

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

  if ((!columns || !columns.length) && !server) return null;

  return (
    <div className={clsx('mt-[8px] mb-[16px] w-full overflow-x-auto', styles['rules-table'])}>
      {loading ? (
        <div className="w-full flex justify-center items-center p-[32px]">
          <Loading />
        </div>
      ) : (
        <Table
          dataSource={dataSource || []}
          columns={columns}
          pagination={null}
          loading={loading}
          scroll={{
            x: 'max-content',
          }}
        />
      )}
    </div>
  );
}

export default React.memo(EventsTable);
