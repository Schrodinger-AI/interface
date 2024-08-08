import { Button } from 'aelf-design';
import { CollapseProps, Flex } from 'antd';
import clsx from 'clsx';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import CommonCopy from 'components/CommonCopy';
import { useWalletService } from 'hooks/useWallet';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { useCallback, useMemo, useState } from 'react';
import useForestSdk from 'hooks/useForestSdk';
import { useRouter } from 'next/navigation';
import { Collapse } from 'antd';
import styles from './style.module.css';
import { TModalTheme } from 'components/CommonModal';
import CommonPagination from 'components/CommonPagination';
import { FormatListingType } from 'types';

export default function ListingInfo({
  page,
  pageSize,
  total,
  data,
  onChange,
  rate,
  symbol,
  theme = 'light',
  onRefresh,
}: {
  page: number;
  pageSize: number;
  total: number;
  data: Array<FormatListingType>;
  onChange: (page?: number, pageSize?: number) => void;
  rate: number;
  symbol: string;
  theme?: TModalTheme;
  onRefresh: () => void;
}) {
  const { wallet } = useWalletService();
  const [expend, setExpend] = useState(true);

  const router = useRouter();

  const isDark = useMemo(() => theme === 'dark', [theme]);

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

  const items: CollapseProps['items'] = useMemo(
    () => [
      {
        key: 'content',
        label: <div className={clsx('font-medium text-lg', isDark ? 'dark-title' : 'text-neutralTitle')}>Listing</div>,
        children: (
          <>
            <div className={clsx('w-full overflow-hidden', isDark && 'bg-pixelsModalBg')}>
              {data?.map((list, index) => {
                const usdPrice = list?.price * (list?.purchaseToken?.symbol === 'ELF' ? rate : 1);
                return (
                  <div
                    key={index}
                    className={clsx(
                      'text-sm font-normal px-[24px] border-solid border border-x-0 border-t-0',
                      index === data.length - 1 && 'border-none',
                      isDark ? 'border-pixelsBorder' : 'border-[#EDEDED]',
                    )}>
                    <div className="py-6">
                      <Flex vertical gap={16}>
                        <Flex justify="space-between" align="center">
                          <span className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
                            Unit Price
                          </span>
                          <span
                            className={clsx(
                              'font-medium',
                              isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
                            )}>{`${formatTokenPrice(list.price)} ${list.purchaseToken.symbol}`}</span>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <span className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
                            Unit USD Price
                          </span>
                          <span className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                            {formatUSDPrice(Number(usdPrice))}
                          </span>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <span className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>Amount</span>
                          <span className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                            {formatNumber(list.quantity)}
                          </span>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <span className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
                            Expiration
                          </span>
                          <span className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                            {list.expiration || '--'}
                          </span>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <span className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>From</span>
                          <Flex align="center">
                            {list.ownerAddress === wallet.address ? (
                              <span className={clsx(isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>you</span>
                            ) : (
                              <span className={clsx(isDark ? 'text-pixelsTertiaryTextPurple' : 'text-neutralTitle')}>
                                {getOmittedStr(list.fromName || '', OmittedType.ADDRESS)}
                              </span>
                            )}
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
                              className={clsx('!w-[75px] !rounded-md !ml-auto', isDark && '!primary-button-dark')}
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
                <CommonPagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  showSizeChanger={false}
                  pageChange={onChange}
                  theme={theme}
                  hideOnSinglePage
                />
              </div>
            )}
          </>
        ),
      },
    ],
    [data, isDark, onChange, onClick, page, pageSize, rate, theme, total, wallet.address],
  );

  return (
    <>
      <Collapse
        className={clsx(
          'w-full mt-4 border overflow-hidden',
          styles['collapse-custom'],
          isDark && styles['collapse-custom-dark'],
          isDark
            ? 'rounded-none border-pixelsPrimaryTextPurple border-dashed bg-pixelsModalBg'
            : 'rounded-lg border-neutralDivider border-solid bg-transparent',
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
