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
import { useEffectOnce } from 'react-use';
import clsx from 'clsx';
import { TSGRToken } from 'types/tokens';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useResetHandler } from 'hooks/useResetHandler';
import useLoading from 'hooks/useLoading';

export default function DetailPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol');
  const getSchrodingerDetail = useGetSchrodingerDetail();
  const { wallet, isLogin } = useWalletService();
  const cmsInfo = useCmsInfo();
  const { showLoading, closeLoading, visible: isLoading } = useLoading();

  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRToken>();
  const adoptHandler = useAdoptHandler();
  const resetHandler = useResetHandler();

  useEffectOnce(() => {
    // if (!isLogin) {
    //   route.push('/');
    // }
  });

  const getDetail = useCallback(async () => {
    showLoading();
    const result = await getSchrodingerDetail({
      input: { symbol: symbol ?? '', chainId: cmsInfo?.curChain || '', address: wallet.address },
    });
    console.log('result', result);
    setSchrodingerDetail(result.data.getSchrodingerDetail);
    console.log('schrodingerDetail', result.data.getSchrodingerDetail);
    closeLoading();
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

  const showAdopt = useMemo(() => (schrodingerDetail?.generation || 0) < 9, [schrodingerDetail?.generation]);
  const showReset = useMemo(() => (schrodingerDetail?.generation || 0) > 0, [schrodingerDetail?.generation]);

  const adoptAndResetButton = () => {
    return (
      <div className="flex flex-row">
        {showAdopt && (
          <Button
            type="primary"
            className="!rounded-lg bg-brandDefault !text-[#FFFFFF] mr-[12px]"
            size="medium"
            onClick={onAdoptNextGeneration}>
            Adopt Next-Gen Cat
          </Button>
        )}
        {showReset && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault mr-[12px]"
            size="medium"
            onClick={onReset}>
            Reroll
          </Button>
        )}
      </div>
    );
  };

  const adoptAndResetButtonSamll = () => {
    return (
      <div className="flex flex-row w-full justify-end mt-[40px] mb-[16px]">
        {showAdopt && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault  bg-brandDefault !text-[#FFFFFF] flex-1"
            size="medium"
            onClick={onAdoptNextGeneration}>
            Adopt Next-Gen Cat
          </Button>
        )}
        {showReset && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault ml-[12px] flex-1"
            size="medium"
            onClick={onReset}>
            Reroll
          </Button>
        )}
        {/* {mockData.generation == 0 && (
          <Button
            type="default"
            className="!rounded-lg !border-[#3888FF] !text-[#3888FF] ml-[12px] h-[48px] w-[103px]"
            size="medium"
            onClick={onTrade}>
            Trade
          </Button>
        )} */}
      </div>
    );
  };

  return (
    <section className="mt-[24px] lg:mt-[48px] flex flex-col items-center w-full">
      <div className="w-full max-w-[1360px] hidden lg:block">
        <Breadcrumb
          items={[
            {
              title: <a href="/">Schrodinger</a>,
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
            {/* <Button
              type="default"
              className="!rounded-lg !border-[#3888FF] !text-[#3888FF] h-[48px]"
              size="medium"
              onClick={onTrade}>
              Trade
            </Button> */}
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
        {/* <Button
          type="default"
          className="!rounded-lg !border-[#3888FF] !text-[#3888FF] h-[48px] w-full mt-[16px]"
          size="medium"
          onClick={onTrade}>
          Trade
        </Button> */}
        {schrodingerDetail && <ItemInfo detail={schrodingerDetail} onAdoptNextGeneration={onAdoptNextGeneration} />}

        {adoptAndResetButtonSamll()}
      </div>
    </section>
  );
}
