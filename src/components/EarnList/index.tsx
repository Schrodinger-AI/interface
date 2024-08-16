import { formatNumber } from 'utils/format';
import { EarnAmountCount } from './components/EarnAmountCount';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { TableColumnsType } from 'antd';
import ActionComponent, { jumpToEcoEarn } from './components/ActionComponent';
import ColumnsTitle from './components/ColumnsTitle';
import TableCell from './components/TableCell';
import { useCmsInfo } from 'redux/hooks';
import { useResponsive } from 'hooks/useResponsive';
import styles from './index.module.css';
import useTelegram from 'hooks/useTelegram';
import { ReactComponent as ArrowIcon } from 'assets/img/icons/arrow.svg';
import CommonTable from 'components/CommonTable';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';

interface ITokenEarnListProps {
  dataSource: Array<IPointItem>;
  hasBoundAddress?: boolean;
  boundEvmAddress?: string;
  theme?: TModalTheme;
  bindAddress?: () => void;
}

export function TokenEarnList({
  dataSource,
  hasBoundAddress = false,
  theme = 'light',
  bindAddress,
  boundEvmAddress,
}: ITokenEarnListProps) {
  const cmsInfo = useCmsInfo();
  const { isLG } = useResponsive();
  const { isInTG } = useTelegram();

  const columns: TableColumnsType<IPointItem> = useMemo(() => {
    const isDark = theme === 'dark';
    return [
      {
        title: <ColumnsTitle title="Rewarding Behaviors" theme={theme} />,
        dataIndex: 'displayName',
        key: 'symbol',
        width: isLG ? 160 : 'max-content',
        render: (displayName: string, record: IPointItem) => {
          if (cmsInfo?.needBindEvm && cmsInfo.needBindEvm.includes(record.symbol)) {
            return (
              <TableCell
                value={
                  <span className={clsx(isDark ? 'text-pixelsWhiteBg' : 'text-neutralSecondary')}>{displayName}</span>
                }
                tooltip={[
                  '1. Receive point rewards by contributing LP to the SGR/USDT trading pair on Uniswap V3, with a fee rate of 1%. Provide the EVM address of the LP and start accumulating daily rewards.',
                  '2. An aelf address can only be bound to one EVM address, and vice versa.',
                  '3. Do note that after an address is bound, it cannot be changed. Therefore, please confirm that the EVM address is correct.',
                ]}
              />
            );
          }
          return (
            <TableCell
              value={
                <span className={clsx(isDark ? 'text-pixelsWhiteBg' : 'text-neutralSecondary')}>{displayName}</span>
              }
            />
          );
        },
      },
      {
        title: <ColumnsTitle title="Points" theme={theme} />,
        dataIndex: 'amount',
        key: 'amount',
        width: isLG ? 300 : 400,
        render: (amount: number, record: IPointItem) => {
          if (record.action === 'SelfIncrease') {
            return (
              <TableCell
                theme={theme}
                value={
                  record.amount ? (
                    <>
                      <EarnAmountCount {...record} amount={amount} />
                      {` ${record.symbol}`}
                    </>
                  ) : (
                    '--'
                  )
                }
              />
            );
          }
          return (
            <TableCell
              theme={theme}
              value={
                amount
                  ? `${formatNumber(
                      BigNumber(amount)
                        .dividedBy(10 ** 8)
                        .toNumber(),
                    )} ${record.symbol}`
                  : '--'
              }
            />
          );
        },
      },
      {
        title: (
          <ColumnsTitle
            theme={theme}
            title="Mining Rewards"
            tooltip={['Points are automatically mined on the mining platform, earning SGR rewards. ']}
          />
        ),
        dataIndex: 'ecoEarnReward',
        key: 'ecoEarnReward',
        width: isLG ? 300 : 'max-content',
        render: (ecoEarnReward: string) => {
          return <TableCell theme={theme} value={ecoEarnReward || '--'} />;
        },
      },
      {
        title: <ColumnsTitle title="Action" theme={theme} />,
        dataIndex: 'action',
        key: 'action',
        width: isLG ? 115 : 'max-content',
        fixed: isLG ? 'right' : false,
        render: (_: null, record: IPointItem) => {
          return isInTG ? (
            <div className="w-max flex items-center cursor-pointer" onClick={() => jumpToEcoEarn(cmsInfo)}>
              <span
                className={clsx(
                  'text-xs font-medium',
                  isDark ? 'text-pixelsSecondaryTextPurple' : 'text-brandDefault',
                )}>
                Details
              </span>
              <ArrowIcon
                className={clsx('scale-75 ml-[8px]', isDark ? 'fill-pixelsSecondaryTextPurple' : 'fill-brandDefault')}
              />
            </div>
          ) : (
            <ActionComponent
              data={record}
              bindAddress={bindAddress}
              hasBoundAddress={hasBoundAddress}
              boundEvmAddress={boundEvmAddress}
            />
          );
        },
      },
    ];
  }, [isLG, cmsInfo, isInTG, bindAddress, hasBoundAddress, boundEvmAddress, theme]);

  const formatDataSource = useMemo(() => {
    if (isInTG) {
      return dataSource.filter((item) => !(cmsInfo?.needBindEvm && cmsInfo.needBindEvm.includes(item.symbol)));
    } else {
      return dataSource;
    }
  }, [cmsInfo?.needBindEvm, dataSource, isInTG]);

  if (!dataSource?.length) return null;
  return (
    <div className={clsx(styles['earn-list'], theme === 'dark' && styles['earn-list-dark'])}>
      <CommonTable
        dataSource={formatDataSource}
        columns={columns}
        theme={theme}
        scroll={{
          x: 'max-content',
        }}
      />
    </div>
  );
}
