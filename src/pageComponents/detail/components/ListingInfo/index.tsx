import { Button, Pagination } from 'aelf-design';
import { Flex } from 'antd';
import { FormatListingType } from 'types';
import clsx from 'clsx';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import CommonCopy from 'components/CommonCopy';
import { useWalletService } from 'hooks/useWallet';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { useCallback } from 'react';
import useForestSdk from 'hooks/useForestSdk';
import { useRouter } from 'next/navigation';

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

  return (
    <div className="w-full rounded-lg border-solid border border-[#EDEDED] flex flex-col mt-[16px]">
      <div className="w-full h-[72px] flex flex-row justify-between items-center p-[24px] border-solid border border-[#E1E1E1] border-x-0 border-t-0">
        <div className="text-neutralTitle font-medium	text-lg">Listing</div>
        <ArrowSVG className={clsx('size-4', 'mr-[16px]', { ['common-revert-180']: true })} />
      </div>
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
                      <CommonCopy className="ml-2 cursor-pointer" toCopy={addPrefixSuffix(list?.ownerAddress || '')} />
                    </Flex>
                  </Flex>
                  {list.ownerAddress !== wallet.address && (
                    <Flex justify="end">
                      <Button
                        type="primary"
                        size="small"
                        className="!w-[75px] !rounded-md"
                        onClick={() => {
                          onClick(list);
                        }}>
                        Buy
                      </Button>
                    </Flex>
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
    </div>
  );
}
