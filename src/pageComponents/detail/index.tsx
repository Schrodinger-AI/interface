import { useEffect } from 'react';
import { Button } from 'aelf-design';
import DetailTitle from './components/DetailTitle';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';
import { useResponsive } from 'ahooks';
import { Breadcrumb } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import mockData from './mock.json';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetSchrodingerDetail } from 'graphqlServer/hooks';
import { useWalletService } from 'hooks/useWallet';
import { useCmsInfo } from 'redux/hooks';
import { useEffectOnce } from 'react-use';
import clsx from 'clsx';

export default function DetailPage() {
  const responsive = useResponsive();
  const route = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol');
  const getSchrodingerDetail = useGetSchrodingerDetail();
  const { wallet, isLogin } = useWalletService();
  const cmsInfo = useCmsInfo();

  useEffectOnce(() => {
    // if (!isLogin) {
    //   route.push('/');
    // }
  });

  useEffect(() => {
    getSchrodingerDetail({ input: { symbol: symbol ?? '', chainId: cmsInfo?.curChain || '', address: wallet.address } })
      .then((data) => {
        console.log('aaaa');
        console.log('data : ' + JSON.stringify(data));
      })
      .catch((err) => {
        console.log('err : ' + JSON.stringify(err));
      });
  }, [symbol, getSchrodingerDetail, wallet.address, cmsInfo?.curChain]);

  const onAdoptNextGeneration = () => {
    // todo
  };

  const onReset = () => {
    // todo
  };

  const onTrade = () => {
    // todo
  };

  const onBack = () => {
    route.back();
  };

  const adoptAndResetButton = () => {
    return (
      <div className="flex flex-row">
        {mockData.generation < 9 && (
          <Button
            type="primary"
            className="!rounded-lg  bg-[#3888FF] !text-[#FFFFFF] mr-[12px]"
            size="medium"
            onClick={onAdoptNextGeneration}>
            Adopt Next Generation
          </Button>
        )}
        {mockData.generation > 0 && (
          <Button
            type="default"
            className="!rounded-lg !border-[#3888FF] !text-[#3888FF] mr-[12px]"
            size="medium"
            onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
    );
  };

  const adoptAndResetButtonSamll = () => {
    return (
      <div className="flex flex-row w-full justify-end mt-[40px] mb-[16px]">
        {mockData.generation < 9 && (
          <Button
            type="default"
            className="!rounded-lg !border-[#3888FF]  bg-[#3888FF] !text-[#FFFFFF] flex-1"
            size="medium"
            onClick={onAdoptNextGeneration}>
            Adopt Next Generation
          </Button>
        )}
        {mockData.generation > 0 && (
          <Button
            type="default"
            className="!rounded-lg !border-[#3888FF] !text-[#3888FF] ml-[12px] flex-1"
            size="medium"
            onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
    );
  };

  return (
    <section className="mt-[24px] lg:mt-[48px] flex flex-col items-center w-full">
      {responsive.lg ? (
        <div className="w-full max-w-[1360px]">
          <Breadcrumb
            items={[
              {
                title: <a href="/">Schrodinger</a>,
              },
              {
                title: <div>{mockData.symbol}</div>,
              },
            ]}
          />
          <div className="w-full h-[68px] mt-[40px] flex flex-row justify-between">
            <DetailTitle detail={mockData} />
            <div className="h-full flex flex-row items-end">
              {adoptAndResetButton()}
              <Button
                type="default"
                className="!rounded-lg !border-[#3888FF] !text-[#3888FF] h-[48px]"
                size="medium"
                onClick={onTrade}>
                Trade
              </Button>
            </div>
          </div>
          <div className="w-full mt-[24px] flex flex-row justify-between">
            <ItemImage detail={mockData} />
            <ItemInfo detail={mockData} onAdoptNextGeneration={onAdoptNextGeneration} />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1360px] flex flex-col items-center">
          <div className="w-full flex flex-row justify-start items-center" onClick={onBack}>
            <ArrowSVG className={clsx('size-4', { ['common-revert-90']: true })} />
            <div className="ml-[8px] font-semibold text-sm w-full">Back</div>
          </div>
          <div className="mt-[16px]" />
          <DetailTitle detail={mockData} />
          <ItemImage detail={mockData} />
          <Button
            type="default"
            className="!rounded-lg !border-[#3888FF] !text-[#3888FF] h-[48px] w-full mt-[16px]"
            size="medium"
            onClick={onTrade}>
            Trade
          </Button>
          <ItemInfo detail={mockData} onAdoptNextGeneration={onAdoptNextGeneration} />
          {adoptAndResetButtonSamll()}
        </div>
      )}
    </section>
  );
}
