import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'aelf-design';
import DetailTitle from './components/DetailTitle';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';
import { Breadcrumb } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetSchrodingerDetail } from 'graphqlServer/hooks';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { useCmsInfo } from 'redux/hooks';
import clsx from 'clsx';
import { TSGRToken } from 'types/tokens';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useResetHandler } from 'hooks/useResetHandler';
import useLoading from 'hooks/useLoading';
import { useTimeoutFn } from 'react-use';
import MarketModal from 'components/MarketModal';
import { useModal } from '@ebay/nice-modal-react';

export default function DetailPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol');
  const getSchrodingerDetail = useGetSchrodingerDetail();
  const { wallet } = useWalletService();
  const cmsInfo = useCmsInfo();
  const { showLoading, closeLoading, visible } = useLoading();
  const { isOK } = useCheckLoginAndToken();
  const marketModal = useModal(MarketModal);

  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRToken>();
  const adoptHandler = useAdoptHandler();
  const resetHandler = useResetHandler();

  const getDetail = useCallback(async () => {
    if (!wallet.address) return;
    showLoading();
    const result = await getSchrodingerDetail({
      input: { symbol: symbol ?? '', chainId: cmsInfo?.curChain || '', address: wallet.address },
    });
    console.log('result', result);
    setSchrodingerDetail(result.data.getSchrodingerDetail);
    console.log('schrodingerDetail', result.data.getSchrodingerDetail);
    closeLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmsInfo?.curChain, getSchrodingerDetail, symbol, wallet.address]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  const onAdoptNextGeneration = () => {
    if (!schrodingerDetail) return;
    adoptHandler(schrodingerDetail, wallet.address);
  };

  const onReset = () => {
    if (!schrodingerDetail) return;
    resetHandler(schrodingerDetail, wallet.address);
  };

  const onBack = () => {
    route.back();
  };

  const showAdopt = useMemo(() => schrodingerDetail && (schrodingerDetail?.generation || 0) < 9, [schrodingerDetail]);
  const showReset = useMemo(() => (schrodingerDetail?.generation || 0) > 0, [schrodingerDetail?.generation]);

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

  const onTrade = useCallback(() => marketModal.show({ title: 'Trade' }), [marketModal]);

  useTimeoutFn(() => {
    if (!isOK) {
      route.push('/');
    }
  }, 3000);

  return (
    <section className="mt-[24px] lg:mt-[48px] flex flex-col items-center w-full">
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
        <div className="w-full h-[68px] mt-[40px] flex flex-row justify-between">
          {schrodingerDetail && <DetailTitle detail={schrodingerDetail} />}
          <div className="h-full flex flex-row items-end">
            {adoptAndResetButton()}
            {cmsInfo?.isTradeShow && schrodingerDetail && (
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
        <div className="w-full mt-[24px] flex flex-row justify-between">
          {schrodingerDetail && <ItemImage detail={schrodingerDetail} />}
          {schrodingerDetail && <ItemInfo detail={schrodingerDetail} onAdoptNextGeneration={onAdoptNextGeneration} />}
        </div>
      </div>

      <div className="w-full max-w-[1360px] flex flex-col items-center lg:hidden">
        <div className="w-full flex flex-row justify-start items-center" onClick={onBack}>
          <ArrowSVG className={clsx('size-4', { ['common-revert-90']: true })} />
          <div className="ml-[8px] font-semibold text-sm w-full">Back</div>
        </div>
        <div className="mt-[16px]" />
        {schrodingerDetail && <DetailTitle detail={schrodingerDetail} />}
        {schrodingerDetail && <ItemImage detail={schrodingerDetail} />}
        {cmsInfo?.isTradeShow && schrodingerDetail && (
          <Button
            type="default"
            className="!rounded-lg !border-[#3888FF] !text-[#3888FF] h-[48px] w-full mt-[16px]"
            size="medium"
            onClick={onTrade}>
            Trade
          </Button>
        )}
        {schrodingerDetail && <ItemInfo detail={schrodingerDetail} onAdoptNextGeneration={onAdoptNextGeneration} />}

        {adoptAndResetButtonSmall()}
      </div>
    </section>
  );
}
