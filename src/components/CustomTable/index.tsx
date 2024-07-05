import React, { useCallback, useMemo } from 'react';
import styles from './style.module.css';
import clsx from 'clsx';
import { Table, ToolTip } from 'aelf-design';
import Loading from 'components/Loading';
import { TableColumnsType } from 'antd';
import CommonCopy from 'components/CommonCopy';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { useResponsive } from 'hooks/useResponsive';
import { formatTokenPrice } from 'utils/format';
import { IEventsDetailListTable } from 'pageComponents/events-detail/types/type';

interface IProps {
  loading?: boolean;
  dataSource?: IEventsDetailListTable['data'];
  header?: IEventsDetailListTable['header'];
}

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

function CustomTable({ loading = false, dataSource = [], header = [] }: IProps) {
  const { isLG } = useResponsive();

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
        <Table
          dataSource={dataSource}
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

export default React.memo(CustomTable);
