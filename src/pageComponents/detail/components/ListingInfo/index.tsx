import { Button, Pagination } from 'aelf-design';
import { CollapseProps, Flex } from 'antd';
import { FormatListingType } from 'types';
import clsx from 'clsx';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import CommonCopy from 'components/CommonCopy';
import { useWalletService } from 'hooks/useWallet';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { useCallback, useState } from 'react';
import useForestSdk from 'hooks/useForestSdk';
import { useRouter } from 'next/navigation';
import { Collapse } from 'antd';
import styles from './style.module.css';

export default function ListingInfo({
  page,
  pageSize,
  total,
  data,
  onChange,
  rate,
  symbol,
  onRefresh,
}: {
  page: number;
  pageSize: number;
  total: number;
  data: Array<FormatListingType>;
  onChange: (page?: number, pageSize?: number) => void;
  rate: number;
  symbol: string;
  onRefresh: () => void;
}) {
  const { wallet } = useWalletService();
  const [expend, setExpend] = useState(true);

  const router = useRouter();

  const { buyNow } = useForestSdk({
    symbol,
    onViewNft: () => {
      router.replace('/telegram?pageState=1');
    },
  });

  const onClick = useCallback(
    async (list: FormatListingType) => {
      buyNow(list);
    },
    [buyNow],
  );

  const items: CollapseProps['items'] = [
    {
      key: 'content',
      label: <div className="text-neutralTitle font-medium text-lg">Listing</div>,
      children: (
        <>
          <div className="w-full overflow-hidden">
            {data?.map((list, index) => {
              const usdPrice = list?.price * (list?.purchaseToken?.symbol === 'ELF' ? rate : 1);
              return (
                <div
                  key={index}
                  className={clsx(
                    'text-sm font-normal px-[24px] border-solid border border-[#EDEDED] border-x-0 border-t-0',
                    index === data.length - 1 && 'border-none',
                  )}>
                  <div className="py-6">
                    <Flex vertical gap={16}>
                      <Flex justify="space-between" align="center">
                        <span className="text-neutralSecondary">Unit Price</span>
                        <span className="text-neutralTitle font-medium">{`${formatTokenPrice(list.price)} ${
                          list.purchaseToken.symbol
                        }`}</span>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <span className="text-neutralSecondary">Unit USD Price</span>
                        <span className="text-neutralTitle font-medium">{formatUSDPrice(Number(usdPrice))}</span>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <span className="text-neutralSecondary">Amount</span>
                        <span className="text-neutralTitle font-medium">{formatNumber(list.quantity)}</span>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <span className="text-neutralSecondary">Expiration</span>
                        <span className="text-neutralTitle font-medium">{list.expiration || '--'}</span>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <span className="text-neutralSecondary">From</span>
                        <Flex align="center">
                          {list.ownerAddress === wallet.address
                            ? 'you'
                            : getOmittedStr(list.fromName || '', OmittedType.ADDRESS)}
                          <CommonCopy
                            className="ml-2 cursor-pointer"
                            toCopy={addPrefixSuffix(list?.ownerAddress || '')}
                          />
                        </Flex>
                      </Flex>
                      {list.ownerAddress !== wallet.address && (
                        <div className="w-full">
                          <Button
                            type="primary"
                            size="small"
                            className="!w-[75px] !rounded-md !ml-auto"
                            onClick={() => {
                              onClick(list);
                            }}>
                            Buy
                          </Button>
                        </div>
                      )}
                    </Flex>
                  </div>
                </div>
              );
            })}
          </div>
          {total > pageSize && (
            <div className="p-4">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger={false}
                pageChange={onChange}
                hideOnSinglePage
              />
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Collapse
        className={clsx(
          'w-full mt-4 rounded-lg border-solid border border-[#EDEDED] overflow-hidden',
          styles['collapse-custom'],
        )}
        expandIconPosition="end"
        items={items}
        defaultActiveKey={['content']}
        onChange={(key: Array<string> | string) => {
          if (key?.includes('content')) {
            setExpend(true);
          } else {
            setExpend(false);
          }
        }}
        expandIcon={() => <ArrowSVG className={clsx('size-4', 'mr-[16px]', expend && 'common-revert-180')} />}
      />
    </>
  );
}
