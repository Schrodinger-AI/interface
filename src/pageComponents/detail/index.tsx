import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown } from 'aelf-design';
import DetailTitle from './components/DetailTitle';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';
import { Breadcrumb, message } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWalletService } from 'hooks/useWallet';
import { useCmsInfo } from 'redux/hooks';
import clsx from 'clsx';
import { ITrait, TSGRTokenInfo } from 'types/tokens';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useResetHandler } from 'hooks/useResetHandler';
import useLoading from 'hooks/useLoading';
import { useTimeoutFn } from 'react-use';
import MarketModal from 'components/MarketModal';
import { useModal } from '@ebay/nice-modal-react';
import { formatTraits } from 'utils/formatTraits';
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { usePageForm } from './hooks';
import { getCatDetail } from 'api/request';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useWebLoginEvent, WebLoginEvents } from 'aelf-web-login';
import { renameSymbol } from 'utils/renameSymbol';
import { useJumpToPage } from 'hooks/useJumpToPage';
import Image from 'next/image';
import TagNewIcon from 'assets/img/event/tag-new.png';
import useTelegram from 'hooks/useTelegram';
import useListingsList from 'pageComponents/tg-home/hooks/useListingsList';
import ListingInfo from './components/ListingInfo';
import styles from './style.module.css';
import { useGetListItemsForSale, useSaleInfo } from 'hooks/useSaleService';
import { divDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';
import { ItemType } from 'antd/es/menu/interface';
import useForestSdk from 'hooks/useForestSdk';
import 'forest-ui-react/dist/assets/index.css';
import { TModalTheme } from 'components/CommonModal';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';

export default function DetailPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const callbackPath = searchParams.get('callbackPath') || '';
  const [fromListAll] = usePageForm();
  const { isLogin } = useGetLoginStatus();

  const { wallet } = useWalletService();
  const cmsInfo = useCmsInfo();
  const { showLoading, closeLoading } = useLoading();
  const marketModal = useModal(MarketModal);
  const { jumpToPage } = useJumpToPage();
  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const { isInTelegram } = useTelegram();
  const {
    page,
    pageSize,
    listings,
    totalCount,
    onChange,
    elfPrice,
    fetchData: refreshListing,
  } = useListingsList({
    symbol: schrodingerDetail?.symbol || '',
  });

  const { listedAmount, fetchData: refreshSaleListedInfo } = useGetListItemsForSale({
    symbol: schrodingerDetail?.symbol || '',
    decimals: schrodingerDetail?.decimals || 8,
  });

  const { maxBuyAmount, fetchData: refreshSaleInfo } = useSaleInfo({ symbol: schrodingerDetail?.symbol || '' });

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  const isGenZero = useMemo(() => (schrodingerDetail?.generation || 0) === 0, [schrodingerDetail?.generation]);

  const isGenNine = useMemo(() => (schrodingerDetail?.generation || 0) === 9, [schrodingerDetail?.generation]);

  const tradeModal = useMemo(() => {
    return isGenZero ? cmsInfo?.gen0TradeModal || cmsInfo?.tradeModal : cmsInfo?.tradeModal;
  }, [cmsInfo?.gen0TradeModal, cmsInfo?.tradeModal, isGenZero]);

  const [rankInfo, setRankInfo] = useState<TRankInfoAddLevelInfo>();

  const adoptHandler = useAdoptHandler();
  const resetHandler = useResetHandler();

  const generateCatsRankInfo = async (generation: number, traits: ITrait[], address: string) => {
    if (generation !== 9) {
      setRankInfo(undefined);
      throw '';
    }
    const paramsTraits = formatTraits(traits);
    if (!paramsTraits) {
      setRankInfo(undefined);
      throw '';
    }
    const catsRankProbability = await getCatsRankProbability({
      catsTraits: [paramsTraits],
      address: addPrefixSuffix(address),
    });
    setRankInfo((catsRankProbability && catsRankProbability?.[0]) || undefined);
  };

  const getDetail = useCallback(async () => {
    if (wallet.address && !isLogin) return;
    let result;
    try {
      showLoading();
      result = await getCatDetail({ symbol, chainId: cmsInfo?.curChain || '', address: wallet.address });
      const generation = result?.generation;
      const traits = result?.traits;
      await generateCatsRankInfo(generation, traits, wallet.address);
    } catch (error) {
      console.log('getDetailInGuestMode-error', error);
    } finally {
      closeLoading();
      setSchrodingerDetail(result);
    }
  }, [closeLoading, cmsInfo?.curChain, isLogin, showLoading, symbol, wallet.address]);

  const onAdoptNextGeneration = (isDirect: boolean, theme: TModalTheme) => {
    if (!schrodingerDetail) return;
    adoptHandler({
      parentItemInfo: schrodingerDetail,
      account: wallet.address,
      isDirect,
      rankInfo,
      theme,
    });
  };

  const onReset = (theme: TModalTheme) => {
    if (!schrodingerDetail) return;
    resetHandler({
      parentItemInfo: schrodingerDetail,
      account: wallet.address,
      rankInfo,
      theme,
    });
  };

  const onBack = useCallback(() => {
    if (callbackPath && callbackPath === 'collection') {
      route.back();
      return;
    }
    const baseUrl = isInTG ? `/telegram` : '';
    const path = fromListAll ? `${baseUrl}/` : `${baseUrl}/?pageState=1`;
    route.replace(path);
  }, [callbackPath, fromListAll, isInTG, route]);

  const theme: TModalTheme = useMemo(() => {
    if (isInTG) {
      return 'dark';
    }
    return 'light';
  }, [isInTG]);

  const genGtZero = useMemo(() => (schrodingerDetail?.generation || 0) > 0, [schrodingerDetail?.generation]);
  const genLtNine = useMemo(() => (schrodingerDetail?.generation || 0) < 9, [schrodingerDetail?.generation]);
  const holderNumberGtZero = useMemo(
    () => (schrodingerDetail?.holderAmount || 0) > 0,
    [schrodingerDetail?.holderAmount],
  );
  const showAdopt = useMemo(() => holderNumberGtZero && genLtNine && !isInTG, [genLtNine, holderNumberGtZero, isInTG]);
  const showAdoptDirectly = useMemo(
    () => holderNumberGtZero && (schrodingerDetail?.generation || 0) === 0,
    [holderNumberGtZero, schrodingerDetail?.generation],
  );

  const showReset = useMemo(() => holderNumberGtZero && genGtZero, [genGtZero, holderNumberGtZero]);

  const holderAmount = useMemo(() => {
    return divDecimals(schrodingerDetail?.holderAmount, schrodingerDetail?.decimals).toFixed();
  }, [schrodingerDetail?.decimals, schrodingerDetail?.holderAmount]);

  const showBuyInTrade = useMemo(() => {
    return isInTG && BigNumber(maxBuyAmount).gte(1);
  }, [isInTG, maxBuyAmount]);

  const showSellInTrade = useMemo(() => {
    return isInTG && BigNumber(holderAmount).minus(listedAmount).gte(1);
  }, [holderAmount, isInTG, listedAmount]);

  const showTrade = useMemo(() => {
    return isInTG && (showSellInTrade || showBuyInTrade) && (isGenNine || isGenZero);
  }, [isGenNine, isGenZero, isInTG, showBuyInTrade, showSellInTrade]);

  const refreshData = useCallback(() => {
    getDetail();
    refreshListing();
    refreshSaleListedInfo();
    refreshSaleInfo();
  }, [getDetail, refreshListing, refreshSaleInfo, refreshSaleListedInfo]);

  const { buyNow, sell, nftInfo } = useForestSdk({
    symbol: schrodingerDetail?.symbol || '',
    onViewNft: () => {
      route.replace('/telegram?pageState=1');
    },
  });

  const items: ItemType[] = useMemo(() => {
    const tradeItems = [
      showBuyInTrade && {
        key: 'Buy',
        label: (
          <div
            onClick={() => {
              buyNow();
            }}>
            Buy
          </div>
        ),
      },
      showSellInTrade && {
        key: 'Sell',
        label: (
          <div
            onClick={() => {
              if (!nftInfo) {
                message.warning('Synchronising data on the blockchain. Please wait a few seconds.');
                return;
              }
              sell();
            }}>
            Sell
          </div>
        ),
      },
    ];
    return tradeItems.filter((i) => i) as ItemType[];
  }, [buyNow, nftInfo, sell, showBuyInTrade, showSellInTrade]);

  function adoptAndResetButton() {
    return (
      <div className="flex flex-row">
        {showAdoptDirectly && (
          <Button
            type="primary"
            className="!rounded-lg mr-[12px] w-[240px]"
            size="large"
            onClick={() => onAdoptNextGeneration(true, theme)}>
            Instant GEN9
            {cmsInfo?.adoptDirectlyNew ? (
              <Image alt="new" src={TagNewIcon} width={44} height={47} className="absolute -top-[2px] -right-[2px]" />
            ) : null}
          </Button>
        )}
        {showAdopt && (
          <Button
            type="default"
            className="!rounded-lg relative !border-brandDefault !text-brandDefault mr-[12px] w-[240px]"
            size="large"
            onClick={() => onAdoptNextGeneration(false, theme)}>
            Adopt Next-Gen
          </Button>
        )}
        {showReset && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault mr-[12px]"
            size="large"
            onClick={() => onReset(theme)}>
            Reroll
          </Button>
        )}
        {showTrade && (
          <Dropdown menu={{ items }} placement="topRight" overlayClassName={styles.dropdown}>
            <Button type="primary" className="!rounded-lg mr-[12px] !px-7" size="large">
              Trade
            </Button>
          </Dropdown>
        )}
      </div>
    );
  }

  const adoptAndResetButtonSmall = useCallback(() => {
    return (
      <div
        className={clsx(
          'flex fixed bottom-0 left-0 flex-row w-full justify-end p-[16px] border-0 border-t border-solid',
          theme === 'dark' ? 'bg-pixelsPageBg border-pixelsBorder' : 'bg-neutralWhiteBg border-neutralDivider',
        )}>
        {showAdopt && (
          <Button
            type="default"
            className={clsx('!rounded-lg flex-1', theme === 'dark' && 'default-button-dark')}
            size="large"
            onClick={() => onAdoptNextGeneration(false, theme)}>
            Adopt Next-Gen
          </Button>
        )}
        {showAdoptDirectly && (
          <Button
            type="primary"
            className={clsx('!rounded-lg flex-1 ml-[16px]', theme === 'dark' && '!primary-button-dark')}
            size="large"
            onClick={() => onAdoptNextGeneration(true, theme)}>
            Instant GEN9
            {cmsInfo?.adoptDirectlyNew ? (
              <Image alt="new" src={TagNewIcon} width={44} height={47} className="absolute -top-[2px] -right-[2px]" />
            ) : null}
          </Button>
        )}
        {showReset && (
          <Button
            type="default"
            className={clsx(
              'ml-[16px] w-[100px]',
              isInTG && 'flex-1',
              theme === 'dark' ? '!default-button-dark' : '!rounded-lg !border-brandDefault !text-brandDefault',
            )}
            size="large"
            onClick={() => onReset(theme)}>
            Reroll
          </Button>
        )}
        {showTrade && (
          <Dropdown
            menu={{ items }}
            placement="topRight"
            overlayClassName={clsx(styles.dropdown, theme === 'dark' && styles['dropdown-dark'])}>
            <Button
              type="primary"
              className={clsx('!rounded-lg ml-[16px] !px-7', theme === 'dark' && '!primary-button-dark')}
              size="large">
              Trade
            </Button>
          </Dropdown>
        )}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmsInfo?.adoptDirectlyNew, isInTG, items, showAdopt, showAdoptDirectly, showReset, showTrade, theme]);

  const onTrade = useCallback(() => {
    if (!schrodingerDetail) return;
    if (!tradeModal?.type || tradeModal?.type === 'modal') {
      marketModal.show({ isTrade: true, detail: schrodingerDetail, isGenZero });
    } else {
      const link = tradeModal.link?.includes('/detail/buy')
        ? `${tradeModal.link}/${cmsInfo?.curChain}-${symbol}/${cmsInfo?.curChain}`
        : tradeModal.link;

      jumpToPage({ link, linkType: tradeModal.type });
    }
  }, [
    schrodingerDetail,
    tradeModal?.type,
    tradeModal?.link,
    marketModal,
    isGenZero,
    cmsInfo?.curChain,
    symbol,
    jumpToPage,
  ]);

  useTimeoutFn(() => {
    if (!fromListAll && !isLogin) {
      onBack();
    }
  }, 3000);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => onBack());

  return (
    <section
      className={clsx(
        'mt-[24px] lg:mt-[24px] flex flex-col items-center w-full',
        isInTG && styles.tgDetailContainer,
        theme === 'dark' && 'bg-pixelsPageBg',
      )}>
      <div className="w-full max-w-[1360px] hidden lg:block">
        <Breadcrumb
          items={[
            {
              title: (
                <span className=" cursor-pointer" onClick={onBack}>
                  Schrodinger
                </span>
              ),
            },
            {
              title: <div>{renameSymbol(schrodingerDetail?.symbol)}</div>,
            },
          ]}
        />
        <div className="w-full h-[68px] mt-[40px] overflow-hidden flex flex-row justify-between">
          {schrodingerDetail && <DetailTitle detail={schrodingerDetail} fromListAll={fromListAll} />}
          <div className="h-full flex-1 min-w-max flex flex-row justify-end items-end">
            {adoptAndResetButton()}
            {!isInTG && tradeModal?.show && schrodingerDetail && (
              <Button
                type="default"
                className="!rounded-lg !border-brandDefault !text-brandDefault"
                size="large"
                onClick={onTrade}>
                Trade
              </Button>
            )}
          </div>
        </div>
        <div className="w-full mt-[24px] flex flex-row justify-between items-start">
          {schrodingerDetail && (
            <ItemImage
              detail={schrodingerDetail}
              level={rankInfo?.levelInfo?.level}
              rarity={rankInfo?.levelInfo?.describe}
              rank={rankInfo?.rank}
            />
          )}
          {schrodingerDetail && (
            <ItemInfo
              showAdopt={holderNumberGtZero}
              detail={schrodingerDetail}
              rankInfo={rankInfo}
              onAdoptNextGeneration={() => onAdoptNextGeneration(false, theme)}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-[1360px] flex flex-col items-center lg:hidden">
        <BackCom className="w-full" theme={theme} />
        <div className="mt-[16px]" />
        {schrodingerDetail && <DetailTitle detail={schrodingerDetail} fromListAll={fromListAll} theme={theme} />}
        {schrodingerDetail && (
          <ItemImage
            detail={schrodingerDetail}
            level={rankInfo?.levelInfo?.level}
            rarity={rankInfo?.levelInfo?.describe}
            rank={rankInfo?.rank}
            theme={theme}
          />
        )}
        {!isInTG && tradeModal?.show && schrodingerDetail && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault h-[48px] w-full mt-[16px]"
            size="medium"
            onClick={onTrade}>
            Trade
          </Button>
        )}
        {isInTG && listings && listings.length > 0 && (
          <ListingInfo
            data={listings}
            page={page}
            pageSize={pageSize}
            total={totalCount}
            onChange={onChange}
            rate={Number(elfPrice)}
            theme={theme}
            symbol={schrodingerDetail?.symbol || ''}
            onRefresh={refreshData}
          />
        )}
        {schrodingerDetail && (
          <ItemInfo
            detail={schrodingerDetail}
            rankInfo={rankInfo}
            source={isInTG ? 'telegram' : ''}
            theme={theme}
            onAdoptNextGeneration={() => onAdoptNextGeneration(false, theme)}
          />
        )}
        {adoptAndResetButtonSmall()}
      </div>
    </section>
  );
}
