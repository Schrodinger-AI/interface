import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'aelf-design';
import DetailTitle from './components/DetailTitle';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';
import { Breadcrumb, message } from 'antd';
// import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';
import clsx from 'clsx';
import { ITrait, TSGRTokenInfo } from 'types/tokens';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useResetHandler } from 'hooks/useResetHandler';
import useLoading from 'hooks/useLoading';
import MarketModal from 'components/MarketModal';
import { useModal } from '@ebay/nice-modal-react';
import { formatTraits } from 'utils/formatTraits';
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { getBlindCatDetail, getCatDetail } from 'api/request';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { renameSymbol } from 'utils/renameSymbol';
import { useJumpToPage } from 'hooks/useJumpToPage';
import Image from 'next/image';
import TagNewIcon from 'assets/img/event/tag-new.png';
import useTelegram from 'hooks/useTelegram';
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
import CancelAdoptModal from 'components/CancelAdoptModal';
import { HandleButtonDefault, HandleButtonPrimary } from './components/Button';
import { useGetImageAndConfirm } from 'hooks/Adopt/useGetImageAndConfirm';
import useIntervalGetSchrodingerDetail from 'hooks/Adopt/useIntervalGetSchrodingerDetail';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useOnFinish } from 'hooks/useOnFinish';

export default function DetailPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const prePage = searchParams.get('prePage') || '';
  const pageFrom = searchParams.get('from') || '';
  const pageSource = searchParams.get('source') || '';
  const getImageAndConfirm = useGetImageAndConfirm();
  const intervalFetch = useIntervalGetSchrodingerDetail();
  useOnFinish();

  const callbackPath = searchParams.get('callbackPath') || '';
  const { isLogin } = useGetLoginStatus();

  const { walletInfo } = useConnectWallet();
  const cmsInfo = useCmsInfo();
  const { showLoading, closeLoading } = useLoading();
  const marketModal = useModal(MarketModal);
  const { jumpToPage } = useJumpToPage();
  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const { isInTelegram } = useTelegram();
  const cancelAdoptModal = useModal(CancelAdoptModal);

  const { listedAmount, fetchData: refreshSaleListedInfo } = useGetListItemsForSale({
    symbol: schrodingerDetail?.symbol || '',
    decimals: schrodingerDetail?.decimals || 8,
  });

  const fromListAll = useMemo(() => {
    return pageFrom !== 'my' && pageFrom !== 'blind';
  }, [pageFrom]);

  const { maxBuyAmount, fetchData: refreshSaleInfo } = useSaleInfo({ symbol: schrodingerDetail?.symbol || '' });

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  const isBlind = useMemo(() => {
    return pageFrom === 'blind';
  }, [pageFrom]);

  const isGenZero = useMemo(() => (schrodingerDetail?.generation || 0) === 0, [schrodingerDetail?.generation]);

  const isGenNine = useMemo(() => (schrodingerDetail?.generation || 0) === 9, [schrodingerDetail?.generation]);

  const tradeModal = useMemo(() => {
    return isGenZero ? cmsInfo?.gen0TradeModal || cmsInfo?.tradeModal : cmsInfo?.tradeModal;
  }, [cmsInfo?.gen0TradeModal, cmsInfo?.tradeModal, isGenZero]);

  const [rankInfo, setRankInfo] = useState<TRankInfoAddLevelInfo>();

  const adoptHandler = useAdoptHandler();
  const resetHandler = useResetHandler();

  const onBack = useCallback(() => {
    if (callbackPath && callbackPath === 'collection') {
      route.back();
      return;
    }
    const baseUrl = isInTG ? `/telegram` : '';
    const path = fromListAll
      ? `${baseUrl}/`
      : pageFrom === 'blind'
      ? `${baseUrl}/?pageState=5`
      : `${baseUrl}/?pageState=1`;
    route.replace(path);
  }, [callbackPath, fromListAll, isInTG, pageFrom, route]);

  const generateCatsRankInfo = async (traits: ITrait[]) => {
    // if (generation !== 9) {
    //   setRankInfo(undefined);
    //   throw '';
    // }
    const paramsTraits = formatTraits(traits);
    if (!paramsTraits) {
      setRankInfo(undefined);
      throw '';
    }
    const catsRankProbability = await getCatsRankProbability({ symbol });
    setRankInfo(catsRankProbability || undefined);
  };

  const getDetail = useCallback(async () => {
    if (walletInfo?.address && !isLogin) return;
    let result;
    try {
      showLoading();
      const getDetail = isBlind ? getBlindCatDetail : getCatDetail;
      result = await getDetail({ symbol, chainId: cmsInfo?.curChain || '', address: walletInfo?.address });
      const traits = result?.traits;
      if (pageFrom === 'blind' && !result.symbol) {
        onBack();
      }
      await generateCatsRankInfo(traits);
    } catch (error) {
      console.log('getDetailInGuestMode-error', error);
    } finally {
      closeLoading();
      setSchrodingerDetail(result);
    }
  }, [walletInfo?.address, isLogin, showLoading, isBlind, symbol, cmsInfo?.curChain, pageFrom, onBack, closeLoading]);

  const onAdoptNextGeneration = (isDirect: boolean, theme: TModalTheme) => {
    if (!schrodingerDetail) return;
    adoptHandler({
      parentItemInfo: schrodingerDetail,
      account: walletInfo?.address || '',
      isDirect,
      rankInfo,
      theme,
      isBlind,
      blindMax: divDecimals(schrodingerDetail.holderAmount, schrodingerDetail.decimals).toString(),
      adoptId: schrodingerDetail.adoptId,
    });
  };

  const onReset = useCallback(
    (theme: TModalTheme) => {
      if (!schrodingerDetail) return;
      if (isBlind) {
        if (!schrodingerDetail.adoptId) return;
        const amount = divDecimals(schrodingerDetail.holderAmount, schrodingerDetail.decimals).toFixed();
        cancelAdoptModal.show({
          title: 'Reroll',
          amount: amount,
          adoptId: schrodingerDetail.adoptId,
          theme,
          nftInfo: {
            nftImage: schrodingerDetail.inscriptionImageUri,
            tokenName: schrodingerDetail.tokenName,
            symbol: schrodingerDetail.symbol,
            generation: schrodingerDetail.generation,
          },
          prePage: 'rerollModal',
          source: pageSource,
        });
      } else {
        resetHandler({
          parentItemInfo: schrodingerDetail,
          account: walletInfo?.address || '',
          rankInfo,
          theme,
          prePage: 'rerollModal',
        });
      }
    },
    [cancelAdoptModal, isBlind, pageSource, rankInfo, resetHandler, schrodingerDetail, walletInfo?.address],
  );

  const onView = useCallback(
    async (theme?: TModalTheme) => {
      try {
        if (!schrodingerDetail || !schrodingerDetail.adoptId || !walletInfo?.address || !schrodingerDetail.holderAmount)
          return;
        getImageAndConfirm({
          parentItemInfo: schrodingerDetail,
          childrenItemInfo: {
            adoptId: schrodingerDetail.adoptId,
            outputAmount: schrodingerDetail.holderAmount,
            symbol: schrodingerDetail.symbol,
            tokenName: schrodingerDetail.tokenName,
            inputAmount: `${schrodingerDetail.consumeAmount}`,
            isDirect: schrodingerDetail.directAdoption,
          },
          prePage: 'unbox',
          onSuccessModalCloseCallback: async () => {
            showLoading();
            await intervalFetch.start(symbol);
            intervalFetch.remove();
            closeLoading();
            route.replace(
              `/detail?symbol=${schrodingerDetail.symbol}&from=my&address=${walletInfo.address}&source=${pageSource}&prePage=unbox`,
            );
          },
          theme,
          adoptOnly: false,
        });
      } catch (error) {
        closeLoading();
      }
    },
    [
      closeLoading,
      getImageAndConfirm,
      intervalFetch,
      pageSource,
      route,
      schrodingerDetail,
      showLoading,
      symbol,
      walletInfo?.address,
    ],
  );

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
  const showConfirm = useMemo(() => isBlind && isLogin && schrodingerDetail, [isBlind, isLogin, schrodingerDetail]);

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
    return isInTG && !isBlind && (showSellInTrade || showBuyInTrade) && (isGenNine || isGenZero);
  }, [isGenNine, isGenZero, isInTG, isBlind, showBuyInTrade, showSellInTrade]);

  const refreshData = useCallback(() => {
    getDetail();
    refreshSaleListedInfo();
    refreshSaleInfo();
  }, [getDetail, refreshSaleInfo, refreshSaleListedInfo]);

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
          <HandleButtonPrimary className="mr-[12px] w-[240px]" onClick={() => onAdoptNextGeneration(true, theme)}>
            Instant GEN9
            {cmsInfo?.adoptDirectlyNew ? (
              <Image alt="new" src={TagNewIcon} width={44} height={47} className="absolute -top-[2px] -right-[2px]" />
            ) : null}
          </HandleButtonPrimary>
        )}
        {/* {showAdopt && (
          <HandleButtonDefault className="w-[200px] mr-[12px]" onClick={() => onAdoptNextGeneration(false, theme)}>
            Next-Gen
          </HandleButtonDefault>
        )} */}
        {showReset && (
          <HandleButtonDefault className="w-[200px] mr-[12px]" onClick={() => onReset(theme)}>
            Reroll
          </HandleButtonDefault>
        )}
        {showConfirm && (
          <HandleButtonPrimary className="w-[200px]" onClick={() => onView(theme)}>
            Unbox
          </HandleButtonPrimary>
        )}
        {showTrade && (
          <Dropdown
            menu={{ items }}
            placement="topRight"
            trigger={['click']}
            overlayClassName={clsx(styles.dropdown, theme === 'dark' && styles['dropdown-dark'])}>
            <div
              className={clsx(
                '!px-7 h-[48px] flex justify-center items-center font-medium text-base text-white',
                theme === 'dark' ? '!primary-button-dark !rounded-none' : '!rounded-lg bg-brandDefault',
              )}>
              Trade
            </div>
          </Dropdown>
        )}
      </div>
    );
  }

  const adoptAndResetButtonSmall = useCallback(() => {
    return (
      <div
        className={clsx(
          'flex fixed bottom-0 gap-[16px] left-0 flex-row w-full justify-end p-[16px] border-0 border-t border-solid',
          theme === 'dark' ? 'bg-pixelsPageBg border-pixelsBorder' : 'bg-neutralWhiteBg border-neutralDivider',
        )}>
        {/* {showAdopt && (
          <HandleButtonDefault className={clsx('flex-1')} onClick={() => onAdoptNextGeneration(false, theme)}>
            Next-Gen
          </HandleButtonDefault>
        )} */}
        {showAdoptDirectly && (
          <HandleButtonPrimary className={clsx('flex-1')} onClick={() => onAdoptNextGeneration(true, theme)}>
            Instant GEN9
            {cmsInfo?.adoptDirectlyNew ? (
              <Image alt="new" src={TagNewIcon} width={44} height={47} className="absolute -top-[2px] -right-[2px]" />
            ) : null}
          </HandleButtonPrimary>
        )}
        {showReset && (
          <HandleButtonDefault className={clsx('flex-1')} onClick={() => onReset(theme)}>
            Reroll
          </HandleButtonDefault>
        )}
        {showConfirm && (
          <HandleButtonPrimary className={clsx('flex-1')} onClick={() => onView(theme)}>
            Unbox
          </HandleButtonPrimary>
        )}
        {showTrade && (
          <Dropdown
            menu={{ items }}
            placement="topRight"
            trigger={['click']}
            overlayClassName={clsx(styles.dropdown, theme === 'dark' && styles['dropdown-dark'])}>
            <div
              className={clsx(
                '!px-7 h-[48px] flex justify-center items-center font-medium text-base text-white',
                theme === 'dark' ? '!primary-button-dark !rounded-none' : '!rounded-lg bg-brandDefault',
              )}>
              Trade
            </div>
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

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useEffect(() => {
    if (!fromListAll && !isLogin) {
      onBack();
    }
  }, [fromListAll, isLogin, onBack]);

  const backUrl = useMemo(() => {
    if (isInTG && prePage) {
      switch (prePage) {
        case 'adoptModal':
          return '/telegram/home';
        default:
          return '/telegram?pageState=1';
      }
    }
    return undefined;
  }, [isInTG, prePage]);

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
          {schrodingerDetail && <DetailTitle detail={schrodingerDetail} fromListAll={fromListAll} isBlind={isBlind} />}
          <div className="h-full flex-1 min-w-max flex flex-row justify-end items-end">
            {adoptAndResetButton()}
            {!isInTG && tradeModal?.show && schrodingerDetail && !isBlind && (
              <HandleButtonDefault className="w-[200px]" onClick={onTrade}>
                Trade
              </HandleButtonDefault>
            )}
          </div>
        </div>
        <div className="w-full mt-[24px] flex flex-row justify-between items-start">
          {schrodingerDetail && (
            <ItemImage
              detail={schrodingerDetail}
              level={rankInfo?.levelInfo?.level}
              rarity={rankInfo?.levelInfo?.describe}
              specialTrait={rankInfo?.levelInfo?.specialTrait}
              rank={rankInfo?.rank}
            />
          )}
          {schrodingerDetail && (
            <ItemInfo
              showAdopt={holderNumberGtZero}
              detail={schrodingerDetail}
              rankInfo={rankInfo}
              isBlind={isBlind}
              onAdoptNextGeneration={() => onAdoptNextGeneration(true, theme)}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-[1360px] flex flex-col items-center lg:hidden">
        <BackCom className="w-full" theme={theme} url={backUrl} />
        <div className="mt-[16px]" />
        {schrodingerDetail && (
          <DetailTitle detail={schrodingerDetail} fromListAll={fromListAll} theme={theme} isBlind={isBlind} />
        )}
        {schrodingerDetail && (
          <ItemImage
            detail={schrodingerDetail}
            level={rankInfo?.levelInfo?.level}
            rarity={rankInfo?.levelInfo?.describe}
            specialTrait={rankInfo?.levelInfo?.specialTrait}
            rank={rankInfo?.rank}
            theme={theme}
          />
        )}
        {!isInTG && tradeModal?.show && schrodingerDetail && !isBlind && (
          <HandleButtonDefault className="w-full mt-[16px]" onClick={onTrade}>
            Trade
          </HandleButtonDefault>
        )}
        {isInTG && !isBlind && schrodingerDetail && (
          <ListingInfo
            theme={theme}
            previewImage={schrodingerDetail?.inscriptionImageUri || ''}
            symbol={schrodingerDetail?.symbol || ''}
            tokenName={schrodingerDetail?.tokenName || ''}
            onRefresh={refreshData}
          />
        )}
        {schrodingerDetail && (
          <ItemInfo
            detail={schrodingerDetail}
            rankInfo={rankInfo}
            source={isInTG ? 'telegram' : ''}
            theme={theme}
            onAdoptNextGeneration={() => onAdoptNextGeneration(true, theme)}
          />
        )}
        {adoptAndResetButtonSmall()}
      </div>
    </section>
  );
}
