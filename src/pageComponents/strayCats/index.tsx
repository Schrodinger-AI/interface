import { useWalletService } from 'hooks/useWallet';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'aelf-design';
import { TableColumnsType } from 'antd';
import TableEmpty from 'components/TableEmpty';
import { TStrayCats, useGetStrayCats } from 'graphqlServer';
import SkeletonImage from 'components/SkeletonImage';
import { divDecimals } from 'utils/calculate';
import { useAdoptConfirm } from 'hooks/Adopt/useAdoptConfirm';
import { useCmsInfo } from 'redux/hooks';
import { formatTokenPrice } from 'utils/format';
import { useTimeoutFn } from 'react-use';
import { checkAIService } from 'api/request';
import { useModal } from '@ebay/nice-modal-react';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { AIServerError } from 'utils/formatError';
import { AdoptActionErrorCode } from 'hooks/Adopt/adopt';
import useLoading from 'hooks/useLoading';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { renameSymbol } from 'utils/renameSymbol';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import CommonTable from 'components/CommonTable';
import CommonPagination from 'components/CommonPagination';

const textStyle =
  'block max-w-[84px] lg:max-w-[364px] overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium';

const amountStyle = 'text-sm';

export default function StrayCatsPage(props?: { theme?: TModalTheme }) {
  const { theme = 'light' } = props || {};

  const { isLogin } = useGetLoginStatus();

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const { wallet } = useWalletService();
  const [dataSource, setDataSource] = useState<TStrayCats[]>();
  const [totalCount, setTotalCount] = useState<number>(30);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const cmsInfo = useCmsInfo();
  const asyncModal = useModal(SyncAdoptModal);

  const adoptConfirm = useAdoptConfirm();

  const getStrayCats = useGetStrayCats();

  const handleTableChange = ({ pageSize, page }: { page: number; pageSize?: number }) => {
    pageSize && setPageSize(pageSize);
    page && setPageNum(page);
  };

  const pathName = usePathname();
  const isTGPage = pathName === '/telegram';

  const getStrayCatsData = useCallback(async () => {
    try {
      if (!wallet.address) return;
      setLoading(true);
      const {
        data: { getStrayCats: res },
      } = await getStrayCats({
        input: {
          chainId: cmsInfo?.curChain || '',
          adopter: wallet.address,
          skipCount: (pageNum - 1) * pageSize,
          maxResultCount: pageSize,
        },
      });
      setDataSource(res.data || []);
      setTotalCount(res.totalCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, [cmsInfo?.curChain, getStrayCats, pageNum, pageSize, wallet.address]);

  useEffect(() => {
    getStrayCatsData();
  }, [getStrayCatsData, pageSize, pageNum]);

  const formatAdoptConfirmParams = useCallback((record: TStrayCats) => {
    return {
      tick: '',
      symbol: record.symbol,
      tokenName: record.tokenName,
      amount: '',
      generation: record.gen,
      blockTime: 0,
      decimals: record.decimals,
      inscriptionImageUri: record.inscriptionImageUri,
      traits: record.parentTraits.map((item) => {
        return {
          traitType: item.traitType,
          value: item.value,
          percent: 0,
        };
      }),
    };
  }, []);

  const formatTokenAmount = useCallback((amount: number, decimals: number) => {
    return formatTokenPrice(divDecimals(amount, decimals).toFixed(), {
      decimalPlaces: decimals,
    });
  }, []);

  const checkAIServer = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      const isAIserviceError = await checkAIService();
      if (!isAIserviceError) {
        resolve('continue');
        return;
      }
      asyncModal.show({
        closable: true,
        showLoading: false,
        innerText: AIServerError,
        onCancel: () => {
          asyncModal.hide();
          reject(AdoptActionErrorCode.cancel);
        },
      });
    });
  }, [asyncModal]);

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const onAdopt = useCallback(
    async (record: TStrayCats, theme?: TModalTheme) => {
      try {
        showLoading();
        await checkAIServer();
        closeLoading();
        adoptConfirm({
          parentItemInfo: formatAdoptConfirmParams(record),
          childrenItemInfo: {
            adoptId: record.adoptId,
            outputAmount: record.nextAmount,
            symbol: record.nextSymbol,
            tokenName: record.nextTokenName,
            inputAmount: record.consumeAmount,
            isDirect: record.directAdoption,
          },
          theme,
          account: wallet.address,
        });
      } catch (error) {
        closeLoading();
      }
    },
    [adoptConfirm, checkAIServer, closeLoading, formatAdoptConfirmParams, showLoading, wallet.address],
  );

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
                generation={record.gen}
                img={record.inscriptionImageUri}
              />
              <span className={clsx(textStyle, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>{tokenName}</span>
            </div>
          );
        },
      },
      {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
        render: (symbol) => {
          return (
            <span className={clsx(textStyle, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              {renameSymbol(symbol)}
            </span>
          );
        },
      },
      {
        title: 'Consume Amount',
        dataIndex: 'consumeAmount',
        key: 'consumeAmount',
        render: (consumeAmount, record) => {
          return (
            <span className={clsx(amountStyle, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              {formatTokenAmount(consumeAmount, record.decimals)}
            </span>
          );
        },
      },
      {
        title: 'Amount to Be Received',
        dataIndex: 'receivedAmount',
        key: 'receivedAmount',
        render: (receivedAmount, record) => {
          return (
            <span className={clsx(amountStyle, isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              {formatTokenAmount(receivedAmount, record.decimals)}
            </span>
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        render: (_, record) => {
          return (
            <Button
              type="primary"
              size="small"
              className={clsx(isDark && '!primary-button-dark')}
              onClick={() => onAdopt(record, theme)}>
              Operation
            </Button>
          );
        },
      },
    ],
    [formatTokenAmount, onAdopt, isTGPage, isDark, theme],
  );

  const getColumns = () => {
    if (isTGPage) {
      return columns.filter((item) => {
        if (['Action', 'Name'].includes(item.title as any as string)) {
          return item;
        }
      });
    } else {
      return columns;
    }
  };

  useTimeoutFn(() => {
    if (!isLogin) {
      router.push('/');
    }
  }, 3000);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px]">
        <h1
          className={clsx(
            'pt-[24px] lg:pt-[48px] pb-[8px] font-semibold text-2xl lg:text-4xl',
            isDark ? 'text-pixelsWhiteBg' : 'text-neutralPrimary',
          )}>
          Stray Cats
        </h1>
        <p className={clsx('mt-[8px] text-base', isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
          Here is the list of cats you have consumed, whose next-gen cats are not adopted yet. Click on a cat to
          continue the adoption process.
        </p>
        <div className="w-full mt-[24px] lg:mt-[40px]">
          <CommonTable
            dataSource={dataSource}
            columns={getColumns()}
            loading={loading}
            theme={theme}
            pagination={null}
            locale={{
              emptyText: <TableEmpty title="Phew! There aren't any stray cats in your account." theme={theme} />,
            }}
            scroll={{
              x: 'max-content',
            }}
          />
          {!dataSource?.length || totalCount <= pageSize ? null : (
            <div className="py-[22px]">
              <CommonPagination
                pageSize={pageSize}
                current={pageNum}
                showSizeChanger
                theme={theme}
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
