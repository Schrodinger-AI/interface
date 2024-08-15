import React, { useCallback, useMemo } from 'react';
import styles from './style.module.css';
import clsx from 'clsx';
import { ToolTip } from 'aelf-design';
import Loading from 'components/Loading';
import { TableColumnsType } from 'antd';
import CommonCopy from 'components/CommonCopy';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { useResponsive } from 'hooks/useResponsive';
import { formatTokenPrice } from 'utils/format';
import { IEventsDetailListTable } from 'pageComponents/events-detail/types/type';
import CommonTable from 'components/CommonTable';

export interface ICustomTableProps {
  loading?: boolean;
  dataSource?: IEventsDetailListTable['data'];
  header?: IEventsDetailListTable['header'];
  myData?: {
    rank: string;
    value: string;
    address: string;
  };
}

const renderCell = (value: string, addressClassName?: string) => {
  return <span className={clsx('text-neutralTitle font-medium text-sm', addressClassName)}>{value}</span>;
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

function CustomTable({ loading = false, dataSource = [], header = [], myData }: ICustomTableProps) {
  const { isLG } = useResponsive();

  const renderAddress = useCallback(
    (address: string, addressClassName?: string) => {
      return (
        <CommonCopy toCopy={addPrefixSuffix(address)}>
          {isLG ? (
            renderCell(getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS), addressClassName)
          ) : (
            <ToolTip trigger={'hover'} title={addPrefixSuffix(address)}>
              {renderCell(getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS), addressClassName)}
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
          fixed: item.fixed,
          render: (value, _record, index) => {
            switch (item.type) {
              case 'address':
                if (!value || value === '-') return '-';
                return renderAddress(value);
              case 'number':
                return !value && value !== 0 ? '-' : renderCell(formatTokenPrice(value));
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

  return (
    <div className={clsx('mt-[8px] mb-[16px] w-full overflow-x-auto', styles['custom-table'])}>
      {loading ? (
        <div className="w-full flex justify-center items-center p-[32px]">
          <Loading />
        </div>
      ) : (
        <>
          <CommonTable
            dataSource={dataSource}
            columns={columns}
            pagination={null}
            loading={loading}
            scroll={{
              x: 'max-content',
            }}
          />
          {myData ? (
            <div className="w-full h-[88px] flex flex-col justify-center bg-brandBg rounded-lg px-[16px]">
              <div className="flex justify-between items-center text-base text-neutralTitle font-semibold">
                <span>{myData.rank}</span>
                <span>{myData.value}</span>
              </div>
              {renderAddress(myData.address, '!text-base !font-medium !text-neutralPrimary')}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default React.memo(CustomTable);
