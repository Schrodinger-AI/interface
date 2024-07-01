import { formatTokenPrice } from 'utils/format';
import { EarnAmountCount } from './components/EarnAmountCount';
import BigNumber from 'bignumber.js';
import { Table } from 'aelf-design';
import { useMemo, useState } from 'react';
import { TableColumnsType } from 'antd';
import ActionComponent from './components/ActionComponent';
import ColumnsTitle from './components/ColumnsTitle';
import TableCell from './components/TableCell';
import { useCmsInfo } from 'redux/hooks';
import { useResponsive } from 'hooks/useResponsive';
import styles from './index.module.css';

interface ITokenEarnListProps {
  dataSource: Array<IPointItem>;
  hasBoundAddress?: boolean;
  boundEvmAddress?: string;
  bindAddress?: () => void;
}

export function TokenEarnList({
  dataSource,
  hasBoundAddress = false,
  bindAddress,
  boundEvmAddress,
}: ITokenEarnListProps) {
  const cmsInfo = useCmsInfo();
  const { isLG } = useResponsive();

  const columns: TableColumnsType<IPointItem> = useMemo(() => {
    return [
      {
        title: <ColumnsTitle title="Rewarding Behaviors" />,
        dataIndex: 'displayName',
        key: 'symbol',
        width: isLG ? 160 : 'max-content',
        render: (displayName: string, record: IPointItem) => {
          if (cmsInfo?.needBindEvm && cmsInfo.needBindEvm.includes(record.symbol)) {
            return (
              <TableCell
                value={<span className="text-neutralSecondary">{displayName}</span>}
                tooltip={[
                  '1. Receive point rewards by contributing LP to the SGR/USDT trading pair on Uniswap V3, with a fee rate of 1%. Provide the EVM address of the LP and start accumulating daily rewards.',
                  '2. An aelf address can only be bound to one EVM address, and vice versa.',
                  '3. Do note that after an address is bound, it cannot be changed. Therefore, please confirm that the EVM address is correct.',
                ]}
              />
            );
          }
          return <TableCell value={<span className="text-neutralSecondary">{displayName}</span>} />;
        },
      },
      {
        title: <ColumnsTitle title="Points" />,
        dataIndex: 'amount',
        key: 'amount',
        width: isLG ? 300 : 400,
        render: (amount: number, record: IPointItem) => {
          if (record.action === 'SelfIncrease') {
            return (
              <TableCell
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
              value={
                amount
                  ? `${formatTokenPrice(
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
            title="Mining Rewards"
            tooltip={['Points are automatically mined on the mining platform, earning SGR rewards. ']}
          />
        ),
        dataIndex: 'ecoEarnReward',
        key: 'ecoEarnReward',
        width: isLG ? 300 : 'max-content',
        render: (ecoEarnReward: string) => {
          return <TableCell value={ecoEarnReward || '--'} />;
        },
      },
      {
        title: <ColumnsTitle title="Action" />,
        dataIndex: 'action',
        key: 'action',
        width: isLG ? 115 : 'max-content',
        fixed: isLG ? 'right' : false,
        render: (_: null, record: IPointItem) => {
          return (
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
  }, [bindAddress, cmsInfo?.needBindEvm, hasBoundAddress, isLG, boundEvmAddress]);

  if (!dataSource?.length) return null;
  return (
    <div className={styles['earn-list']}>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{
          x: 'max-content',
        }}
      />
    </div>
  );
}
