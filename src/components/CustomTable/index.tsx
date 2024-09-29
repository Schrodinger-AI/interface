import React, { useCallback, useMemo } from 'react';
import styles from './style.module.css';
import clsx from 'clsx';
import { ToolTip } from 'aelf-design';
import Loading from 'components/Loading';
import { TableColumnsType } from 'antd';
import CommonCopy from 'components/CommonCopy';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { ReactComponent as MeBlueIcon } from 'assets/img/me-blue.svg';
import { ReactComponent as MePurpleIcon } from 'assets/img/me-purple.svg';
import { useResponsive } from 'hooks/useResponsive';
import { formatTokenPrice } from 'utils/format';
import { IEventsDetailListTable } from 'pageComponents/events-detail/types/type';
import CommonTable from 'components/CommonTable';
import { TModalTheme } from 'components/CommonModal';

export interface ICustomTableProps {
  loading?: boolean;
  dataSource?: IEventsDetailListTable['data'];
  header?: IEventsDetailListTable['header'];
  myData?: {
    rank: string;
    value: string;
    address: string;
  };
  theme?: TModalTheme;
  numberDecimal?: number;
}

const renderCell = ({
  value,
  addressClassName,
  theme = 'light',
}: {
  value: string;
  addressClassName?: string;
  theme?: TModalTheme;
}) => {
  return (
    <span
      className={clsx(
        'font-medium text-sm',
        theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
        addressClassName,
      )}>
      {value}
    </span>
  );
};

const renderTitle = ({
  value,
  tooltip,
  theme = 'light',
}: {
  value: string;
  tooltip?: string[];
  theme?: TModalTheme;
}) => {
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
          <Question className={clsx(theme === 'dark' ? 'fill-pixelsBorder' : 'fill-neutralDisable')} />
        </ToolTip>
      ) : null}

      <span className={clsx('text-sm font-medium', theme === 'dark' ? 'text-pixelsBorder' : 'text-neutralDisable')}>
        {value}
      </span>
    </div>
  );
};

function CustomTable({
  loading = false,
  dataSource = [],
  header = [],
  myData,
  numberDecimal = 4,
  theme = 'light',
}: ICustomTableProps) {
  const { isLG } = useResponsive();

  const renderAddress = useCallback(
    (address: string, addressClassName?: string) => {
      return (
        <CommonCopy toCopy={addPrefixSuffix(address)}>
          {isLG ? (
            renderCell({
              value: getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS),
              addressClassName,
              theme,
            })
          ) : (
            <ToolTip trigger={'hover'} title={addPrefixSuffix(address)}>
              {renderCell({
                value: getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS),
                addressClassName,
                theme,
              })}
            </ToolTip>
          )}
        </CommonCopy>
      );
    },
    [isLG, theme],
  );

  const columns: TableColumnsType<any> = useMemo(() => {
    if (header?.length) {
      return header.map((item) => {
        return {
          title: renderTitle({ value: item.title, tooltip: item.tooltip, theme }),
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
                return !value && value !== 0
                  ? '-'
                  : renderCell({
                      value: formatTokenPrice(value, {
                        decimalPlaces: numberDecimal,
                      }),
                      theme,
                    });
              default:
                return renderCell({
                  value: item.key === 'index' ? `${index + 1}` : value,
                  theme,
                });
            }
          },
        };
      });
    } else {
      return [];
    }
  }, [header, numberDecimal, renderAddress, theme]);

  return (
    <div
      className={clsx(
        'mt-[8px] mb-[16px] w-full overflow-x-auto',
        styles['custom-table'],
        theme === 'dark' && styles['custom-table-dark'],
      )}>
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
            theme={theme}
          />
          {myData ? (
            <div
              className={clsx(
                'w-full h-[88px] flex flex-col justify-center px-[16px]',
                theme === 'dark' ? 'bg-pixelsModalBg rounded-none' : 'bg-brandBg rounded-lg',
              )}>
              <span
                className={clsx(
                  'flex text-base font-semibold',
                  theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
                )}>
                {theme === 'dark' ? <MePurpleIcon className="mr-[8px]" /> : <MeBlueIcon className="mr-[8px]" />}

                {myData.rank}
              </span>
              <div
                className={clsx(
                  'flex justify-between items-center text-base font-semibold mt-[8px]',
                  theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
                )}>
                {renderAddress(
                  myData.address,
                  clsx('!text-base !font-medium', theme === 'dark' ? '!text-pixelsDivider' : '!text-neutralPrimary'),
                )}
                <span>{myData.value}</span>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default React.memo(CustomTable);
