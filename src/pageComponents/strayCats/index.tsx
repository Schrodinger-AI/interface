import { getPoints } from 'api/request';
import { useWalletService } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { sleep } from '@portkey/utils';
import { Button, Pagination, Table } from 'aelf-design';
import { TableColumnsType } from 'antd';
import TableEmpty from 'components/TableEmpty';
import { TStrayCats, useGetStrayCats } from 'graphqlServer';
import SkeletonImage from 'components/SkeletonImage';
import { divDecimals } from 'utils/calculate';

export default function StrayCatsPage() {
  const { isLogin } = useWalletService();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { wallet } = useWalletService();
  const [dataSource, setDataSource] = useState<TStrayCats[]>();
  const [totalCount, setTotalCount] = useState<number>(30);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const getStrayCats = useGetStrayCats();

  const handleTableChange = ({ pageSize, page }: { page: number; pageSize?: number }) => {
    console.log('=====handleTableChange', pageSize, page);
    pageSize && setPageSize(pageSize);
    page && setPageNum(page);
  };

  const getStrayCatsData = useCallback(async () => {
    try {
      if (!wallet.address) return;
      setLoading(true);
      const {
        data: { getStrayCats: res },
      } = await getStrayCats({
        input: {
          adopter: wallet.address,
          skipCount: (pageNum - 1) * pageSize,
          maxResultCount: pageSize,
        },
      });
      console.log('=====data', res);
      setDataSource(res.data || []);
      setTotalCount(res.totalCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, [getStrayCats, pageNum, pageSize, wallet.address]);

  useEffect(() => {
    getStrayCatsData();
  }, [getStrayCatsData, pageSize, pageNum]);

  const textStyle = 'text-sm text-neutralTitle font-medium';

  const columns: TableColumnsType<TStrayCats> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'tokenName',
        key: 'tokenName',
        render: (tokenName, record) => {
          return (
            <div className="flex items-center">
              <SkeletonImage
                className="w-[64px] h-[64px] mr-[12px]"
                tag={`GEN ${record.gen}`}
                img={record.inscriptionImageUri}
              />
              <span className={textStyle}>{tokenName}</span>
            </div>
          );
        },
      },
      {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
        render: (symbol) => {
          return <span className={textStyle}>{symbol}</span>;
        },
      },
      {
        title: 'Consume Amount',
        dataIndex: 'consumeAmount',
        key: 'consumeAmount',
        render: (consumeAmount, record) => {
          return <span className={textStyle}>{divDecimals(consumeAmount, record.decimals).toFormat()}</span>;
        },
      },
      {
        title: 'Amount to Be Received',
        dataIndex: 'receivedAmount',
        key: 'receivedAmount',
        render: (receivedAmount, record) => {
          return <span className={textStyle}>{divDecimals(receivedAmount, record.decimals).toFormat()}</span>;
        },
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        render: (_, record) => {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                console.log('=====Adopt record', record);
              }}>
              Adopt
            </Button>
          );
        },
      },
    ],
    [],
  );

  useEffect(() => {
    if (!isLogin) {
      router.push('/');
    }
  }, [isLogin, router]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px]">
        <h1 className="pt-[24px] lg:pt-[48px] pb-[8px] font-semibold text-neutralPrimary text-2xl lg:text-4xl">
          Stray Cats
        </h1>
        <p className="mt-[8px] text-base text-neutralSecondary">
          Here is the list of cats you have consumed, whose next-gen cats are not adopted yet. Click on a cat to
          continue the adoption process.
        </p>
        <div className="w-full mt-[24px] lg:mt-[40px]">
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            pagination={null}
            locale={{
              emptyText: <TableEmpty description="Phew! There aren't any stray cats in your account." />,
            }}
            onChange={(_a, _b) => {
              console.log('=====onchange', _a, _b);
            }}
            scroll={{
              x: 'max-content',
            }}
          />
          {!dataSource?.length || totalCount <= 10 ? null : (
            <div className="py-[22px]">
              <Pagination
                hideOnSinglePage
                pageSize={pageSize}
                current={pageNum}
                showSizeChanger
                total={totalCount ?? 0}
                pageChange={(page, pageSize) => handleTableChange({ page, pageSize })}
                pageSizeChange={(page, pageSize) => handleTableChange({ page, pageSize })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
