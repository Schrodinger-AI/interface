import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'aelf-design';
import DetailTitle from './components/DetailTitle';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';
import { Breadcrumb } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetSchrodingerDetail } from 'graphqlServer/hooks';
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
import { useEffectOnce } from 'react-use';

// const mockData: TSGRTokenInfo = {
//   symbol: 'SGRTEST-4522',
//   tokenName: 'SGRTEST-4522GEN9',
//   inscriptionImageUri: 'ipfs://QmQL44L3cGzSE5MamZiZnFQUj9KC7857yiU2KbP5PMP8gu',
//   amount: '100006500',
//   address: 'dsdsdsdsdsdsdsdsdsdsssds',
//   holderAmount: 1123232300,
//   generation: 9,
//   decimals: 8,
//   traits: [
//     {
//       traitType: 'Background',
//       value: 'Surreal Dreamstate Metropolis',
//       percent: 0.83487940630797773654916512,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Clothes',
//       value: 'Velvet Camisole',
//       percent: 0.7884972170686456400742115,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Breed',
//       value: 'Kanaani',
//       percent: 0.60296846011131725417439703,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Necklace',
//       value: 'Enamel Art Deco Necklace',
//       percent: 2.43902439024390243902439024,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Wing',
//       value: 'Imp Wings',
//       percent: 1.67597765363128491620111732,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Belt',
//       value: 'Vintage Belt',
//       percent: 1.95530726256983240223463687,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Ride (cars alike)',
//       value: 'Cloud Somersault',
//       percent: 1.21212121212121212121212121,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Eyes',
//       value: 'Sunglasses',
//       percent: 1.08108108108108108108108108,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Mouth',
//       value: 'Murmuring',
//       percent: 2.4691358024691358024691358,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Shoes',
//       value: 'Pastel Puddle Jumpers',
//       percent: 0.86206896551724137931034483,
//       __typename: 'TraitDto',
//     },
//     {
//       traitType: 'Accessory(Right Hand)',
//       value: 'Spyglass',
//       percent: 2.93255131964809384164222874,
//       __typename: 'TraitDto',
//     },
//   ],
//   __typename: 'SchrodingerDetailDto',
// };

export default function DetailPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const address = searchParams.get('address') || '';
  const [fromListAll] = usePageForm();

  const getSchrodingerDetail = useGetSchrodingerDetail();
  const { wallet, isLogin } = useWalletService();
  const cmsInfo = useCmsInfo();
  const { showLoading, closeLoading } = useLoading();
  const marketModal = useModal(MarketModal);

  const tradeModal = useMemo(() => {
    return cmsInfo?.tradeModal;
  }, [cmsInfo?.tradeModal]);

  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const [rankInfo, setRankInfo] = useState<TRankInfoAddLevelInfo>();

  const adoptHandler = useAdoptHandler();
  const resetHandler = useResetHandler();
  const isMyself = address === wallet.address;

  const generateCatsRankInfo = useCallback(
    async (generation: number, traits: ITrait[]) => {
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
        address: addPrefixSuffix(wallet.address),
      });
      setRankInfo((catsRankProbability && catsRankProbability?.[0]) || undefined);
    },
    [wallet.address],
  );

  const getDetail = useCallback(async () => {
    if (!wallet.address) return;
    showLoading();
    const result = await getSchrodingerDetail({
      input: { symbol: symbol ?? '', chainId: cmsInfo?.curChain || '', address },
    });

    try {
      const generation = result?.data?.getSchrodingerDetail?.generation;
      const traits = result.data.getSchrodingerDetail.traits;
      await generateCatsRankInfo(generation, traits);
    } catch (error) {
      console.log('getDetail--error', error);
    } finally {
      setSchrodingerDetail(result.data.getSchrodingerDetail);
      closeLoading();
    }
  }, [
    address,
    closeLoading,
    cmsInfo?.curChain,
    generateCatsRankInfo,
    getSchrodingerDetail,
    showLoading,
    symbol,
    wallet.address,
  ]);

  const getDetailInGuestMode = useCallback(async () => {
    console.log('getDetailInGuestMode');
    try {
      showLoading();
      const result = await getCatDetail({ symbol, chainId: cmsInfo?.curChain || '' });
      setSchrodingerDetail(result);

      const generation = result?.generation;
      const traits = result.traits;
      await generateCatsRankInfo(generation, traits);
    } catch (error) {
      console.log('getDetailInGuestMode--error', error);
    } finally {
      closeLoading();
    }
  }, [closeLoading, cmsInfo?.curChain, generateCatsRankInfo, showLoading, symbol]);

  const init = useCallback(() => {
    console.log('init-callback', fromListAll);
    fromListAll ? getDetailInGuestMode() : getDetail();
  }, [fromListAll, getDetail, getDetailInGuestMode]);

  useEffectOnce(() => {
    console.log('init--once');
    init();
  });

  const onAdoptNextGeneration = () => {
    if (!schrodingerDetail) return;
    adoptHandler(schrodingerDetail, wallet.address, rankInfo);
  };

  const onReset = () => {
    if (!schrodingerDetail) return;
    resetHandler(schrodingerDetail, wallet.address, rankInfo);
  };

  const onBack = () => {
    route.back();
  };

  const genGtZero = useMemo(() => (schrodingerDetail?.generation || 0) > 0, [schrodingerDetail?.generation]);
  const genLtNine = useMemo(() => (schrodingerDetail?.generation || 0) < 9, [schrodingerDetail?.generation]);
  const holderNumberGtZero = useMemo(
    () => (schrodingerDetail?.holderAmount || 0) > 0,
    [schrodingerDetail?.holderAmount],
  );
  const showAdopt = useMemo(
    () => (fromListAll ? holderNumberGtZero && genLtNine : genLtNine),
    [fromListAll, genLtNine, holderNumberGtZero],
  );

  const showReset = useMemo(
    () => (fromListAll ? holderNumberGtZero && genGtZero : genGtZero),
    [fromListAll, genGtZero, holderNumberGtZero],
  );

  const adoptAndResetButton = () => {
    return (
      <div className="flex flex-row">
        {showAdopt && (
          <Button type="primary" className="!rounded-lg mr-[12px]" size="large" onClick={onAdoptNextGeneration}>
            Adopt Next-Gen Cat
          </Button>
        )}
        {showReset && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault mr-[12px]"
            size="large"
            onClick={onReset}>
            Reroll
          </Button>
        )}
      </div>
    );
  };

  const adoptAndResetButtonSmall = () => {
    return (
      <div className="flex fixed bottom-0 left-0 flex-row w-full justify-end p-[16px] bg-neutralWhiteBg border-0 border-t border-solid border-neutralDivider ">
        {showAdopt && (
          <Button type="primary" className="!rounded-lg flex-1" size="large" onClick={onAdoptNextGeneration}>
            Adopt Next-Gen Cat
          </Button>
        )}
        {showReset && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault ml-[16px] w-[100px]"
            size="large"
            onClick={onReset}>
            Reroll
          </Button>
        )}
      </div>
    );
  };

  const onTrade = useCallback(() => {
    if (!schrodingerDetail) return;
    marketModal.show({ isTrade: true, detail: schrodingerDetail });
  }, [marketModal, schrodingerDetail]);

  useTimeoutFn(() => {
    if (!fromListAll && !isLogin) {
      route.push('/');
    }
  }, 3000);

  useEffect(() => {
    console.log('isLogin--init', isLogin);
    if (isLogin) {
      init();
    }
  }, [init, isLogin]);

  return (
    <section className="mt-[24px] lg:mt-[24px] flex flex-col items-center w-full">
      <div className="w-full max-w-[1360px] hidden lg:block">
        <Breadcrumb
          items={[
            {
              title: (
                <span className=" cursor-pointer" onClick={() => route.push('/')}>
                  Schrodinger
                </span>
              ),
            },
            {
              title: <div>{schrodingerDetail?.symbol}</div>,
            },
          ]}
        />
        <div className="w-full h-[68px] mt-[40px] overflow-hidden flex flex-row justify-between">
          {schrodingerDetail && <DetailTitle detail={schrodingerDetail} fromListAll={fromListAll} />}
          <div className="h-full flex-1 min-w-max flex flex-row justify-end items-end">
            {isMyself && <> {adoptAndResetButton()}</>}
            {tradeModal?.show && schrodingerDetail && (
              <Button
                type="default"
                className="!rounded-lg !border-[#3888FF] !text-[#3888FF]"
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
              showAdopt={isMyself}
              detail={schrodingerDetail}
              rankInfo={rankInfo}
              onAdoptNextGeneration={onAdoptNextGeneration}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-[1360px] flex flex-col items-center lg:hidden">
        <div className="w-full flex flex-row justify-start items-center" onClick={onBack}>
          <ArrowSVG className={clsx('size-4', { ['common-revert-90']: true })} />
          <div className="ml-[8px] font-semibold text-sm w-full">Back</div>
        </div>
        <div className="mt-[16px]" />
        {schrodingerDetail && <DetailTitle detail={schrodingerDetail} fromListAll={fromListAll} />}
        {schrodingerDetail && (
          <ItemImage
            detail={schrodingerDetail}
            level={rankInfo?.levelInfo?.level}
            rarity={rankInfo?.levelInfo?.describe}
            rank={rankInfo?.rank}
          />
        )}
        {tradeModal?.show && schrodingerDetail && (
          <Button
            type="default"
            className="!rounded-lg !border-[#3888FF] !text-[#3888FF] h-[48px] w-full mt-[16px]"
            size="medium"
            onClick={onTrade}>
            Trade
          </Button>
        )}
        {schrodingerDetail && (
          <ItemInfo detail={schrodingerDetail} rankInfo={rankInfo} onAdoptNextGeneration={onAdoptNextGeneration} />
        )}

        {isMyself && <> {adoptAndResetButtonSmall()}</>}
      </div>
    </section>
  );
}
