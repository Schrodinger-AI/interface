import { Button } from 'aelf-design';
import { CollapseProps, Flex } from 'antd';
import clsx from 'clsx';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import CommonCopy from 'components/CommonCopy';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useForestSdk from 'hooks/useForestSdk';
import { useRouter } from 'next/navigation';
import { Collapse } from 'antd';
import styles from './style.module.css';
import { TModalTheme } from 'components/CommonModal';
import CommonPagination from 'components/CommonPagination';
import { FormatListingType, TCancelListingType } from 'types';
import CommonTabs from 'components/CommonTabs';
import { listingStateList } from './config';
import useListingsList from 'pageComponents/tg-home/hooks/useListingsList';
import { useCancel } from 'forest-ui-react';
import { EmptyList } from 'components/EmptyList';
import Loading from 'components/Loading';
import { COLLECTION_NAME } from 'constants/common';
import { ReactComponent as RefreshSVG } from 'assets/img/telegram/refresh.svg';
import { timesDecimals } from 'utils/calculate';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export default function ListingInfo({
  symbol,
  previewImage,
  tokenName,
  theme = 'light',
  onRefresh,
}: {
  symbol: string;
  tokenName: string;
  previewImage: string;
  theme?: TModalTheme;
  onRefresh: () => void;
}) {
  const { walletInfo } = useConnectWallet();
  const [expend, setExpend] = useState(true);
  const { cancelList } = useCancel({});

  const router = useRouter();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const [listingState, setListingState] = useState<string>('all');

  const {
    page,
    pageSize,
    listings,
    totalCount,
    onChange,
    elfPrice,
    loading,
    fetchData: refreshListing,
  } = useListingsList({
    symbol: symbol || '',
  });

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

  const onCancel = useCallback(
    async (listing: FormatListingType[]) => {
      try {
        const list: TCancelListingType[] = listing.map((item) => {
          return {
            price: item.price,
            quantity: item.quantity,
            previewImage,
            collectionName: COLLECTION_NAME,
            nftName: tokenName,
            nftSymbol: symbol === 'SGR' ? 'SGR-1' : symbol,
            originQuantity: timesDecimals(item.originQuantity, item.decimals).toNumber(),
            startTime: item.startTime,
          };
        });
        console.log('=====list', list);
        await cancelList(list);
      } catch (error) {
        /* empty */
      }
    },
    [cancelList, previewImage, symbol, tokenName],
  );

  const getListingData = useCallback(() => {
    if (listingState === 'all') {
      refreshListing({ page: 1 });
    } else {
      refreshListing({ address: walletInfo?.address, page: 1 });
    }
  }, [listingState, refreshListing, walletInfo?.address]);

  const onPageChange = useCallback(
    ({ page }: { page?: number }) => {
      if (listingState === 'all') {
        onChange({ page });
      } else {
        onChange({ address: walletInfo?.address, page });
      }
    },
    [listingState, onChange, walletInfo?.address],
  );

  useEffect(() => {
    getListingData();
  }, [getListingData]);

  const items: CollapseProps['items'] = useMemo(
    () => [
      {
        key: 'content',
        label: (
          <div className="w-full h-full flex items-center">
            <CommonTabs
              options={listingStateList}
              activeKey={listingState}
              onTabsChange={(value) => !loading && setListingState(value || 'all')}
              theme="dark"
              className={styles['listing-state-tab']}
            />
            <div
              className="p-[16px] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                getListingData();
              }}>
              <RefreshSVG />
            </div>
          </div>
        ),
        children: (
          <>
            <div className={clsx('w-full overflow-hidden', isDark && 'bg-pixelsModalBg')}>
              {!listings.length && !loading ? (
                <div className={clsx('py-[60px]', isDark && 'bg-pixelsModalBg')}>
                  <EmptyList theme={theme} defaultDescription="No listing found yet ~" />
                </div>
              ) : null}

              {loading ? (
                <div className={clsx('py-[60px] flex justify-center items-center', isDark && 'bg-pixelsModalBg')}>
                  <Loading color="purple" />
                </div>
              ) : null}

              {listings.length
                ? listings?.map((list, index) => {
                    const usdPrice = list?.price * (list?.purchaseToken?.symbol === 'ELF' ? Number(elfPrice) : 1);
                    return (
                      <div
                        key={index}
                        className={clsx(
                          'text-sm font-normal px-[24px] border-solid border border-x-0 border-t-0',
                          index === listings.length - 1 && 'border-none',
                          isDark ? 'border-pixelsBorder bg-pixelsModalBg' : 'border-[#EDEDED]',
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
                              <span
                                className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                                {formatUSDPrice(Number(usdPrice))}
                              </span>
                            </Flex>
                            <Flex justify="space-between" align="center">
                              <span className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
                                Amount
                              </span>
                              <span
                                className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                                {formatNumber(list.quantity)}
                              </span>
                            </Flex>
                            <Flex justify="space-between" align="center">
                              <span className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
                                Expiration
                              </span>
                              <span
                                className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                                {list.expiration || '--'}
                              </span>
                            </Flex>
                            <Flex justify="space-between" align="center">
                              <span className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
                                From
                              </span>
                              <Flex align="center">
                                {list.ownerAddress === walletInfo?.address ? (
                                  <span className={clsx(isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>you</span>
                                ) : (
                                  <span
                                    className={clsx(isDark ? 'text-pixelsTertiaryTextPurple' : 'text-neutralTitle')}>
                                    {getOmittedStr(list.fromName || '', OmittedType.ADDRESS)}
                                  </span>
                                )}
                                <CommonCopy
                                  className="ml-2 cursor-pointer"
                                  toCopy={addPrefixSuffix(list?.ownerAddress || '')}
                                />
                              </Flex>
                            </Flex>
                            {list.ownerAddress !== walletInfo?.address && listingState !== 'my' && (
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
                            {list.ownerAddress === walletInfo?.address ? (
                              <div className="w-full">
                                <Button
                                  type="primary"
                                  size="small"
                                  className={clsx('!w-[75px] !rounded-md !ml-auto', isDark && '!default-button-dark')}
                                  onClick={() => onCancel([list])}>
                                  Cancel
                                </Button>
                              </div>
                            ) : null}
                          </Flex>
                        </div>
                      </div>
                    );
                  })
                : null}

              {!loading && listings.length && listingState === 'my' ? (
                <div className="w-full px-[16px] pb-[24px]">
                  <Button
                    type="primary"
                    size="medium"
                    className={clsx('!w-full !rounded-md !ml-auto', isDark && '!default-button-dark')}
                    onClick={() => onCancel(listings)}>
                    Cancel All
                  </Button>
                </div>
              ) : null}
            </div>
            {totalCount > pageSize && (
              <div className="p-4">
                <CommonPagination
                  current={page}
                  pageSize={pageSize}
                  total={totalCount}
                  showSizeChanger={false}
                  pageChange={(page) =>
                    onPageChange({
                      page,
                    })
                  }
                  theme={theme}
                  // hideOnSinglePage
                />
              </div>
            )}
          </>
        ),
      },
    ],
    [
      listingState,
      isDark,
      listings,
      loading,
      theme,
      totalCount,
      pageSize,
      page,
      onPageChange,
      getListingData,
      elfPrice,
      walletInfo?.address,
      onClick,
      onCancel,
    ],
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
