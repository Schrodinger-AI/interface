/* eslint-disable react/no-unescaped-entities */
import { Table, ToolTip } from 'aelf-design';
import { TableColumnsType } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { IActivityDetailRulesTable } from 'redux/types/reducerTypes';
import styles from './style.module.css';
import clsx from 'clsx';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import CommonCopy from 'components/CommonCopy';
import { useResponsive } from 'hooks/useResponsive';
import { formatTokenPrice } from 'utils/format';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';

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

function RulesTable({ header, data }: IActivityDetailRulesTable) {
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

  if (!columns || !columns.length) return null;

  return (
    <div className={clsx('mt-[8px] mb-[16px] w-full overflow-x-auto', styles['rules-table'])}>
      <Table
        dataSource={data || []}
        columns={columns}
        pagination={null}
        scroll={{
          x: 'max-content',
        }}
      />
    </div>
  );
}

export default React.memo(RulesTable);
