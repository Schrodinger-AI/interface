import { Button } from 'aelf-design';
import DetailTitle from './components/DetailTitle';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';
import { useResponsive } from 'ahooks';
import { Breadcrumb } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import mockData from './mock.json';

export default function DetailPage() {
  const responsive = useResponsive();

  const onAdoptNextGeneration = () => {
    // todo
  };

  const onReset = () => {
    // todo
  };

  const onTrade = () => {
    // todo
  };

  const adoptAndResetButton = () => {
    return (
      <div className="flex flex-row">
        <Button
          type="default"
          className="!rounded-lg !border-[#3888FF]  bg-[#3888FF] !text-[#FFFFFF] mr-[12px]"
          size="medium"
          onClick={onAdoptNextGeneration}>
          Adopt Next Generation
        </Button>
        <Button
          type="default"
          className="!rounded-lg !border-[#3888FF] !text-[#3888FF] mr-[12px]"
          size="medium"
          onClick={onReset}>
          Reset
        </Button>
      </div>
    );
  };

  const adoptAndResetButtonSamll = () => {
    return (
      <div className="flex flex-row w-full justify-end mb-[16px]">
        <Button
          type="default"
          className="!rounded-lg !border-[#3888FF]  bg-[#3888FF] !text-[#FFFFFF] mr-[12px] flex-1"
          size="medium"
          onClick={onAdoptNextGeneration}>
          Adopt Next Generation
        </Button>
        <Button
          type="default"
          className="!rounded-lg !border-[#3888FF] !text-[#3888FF]"
          size="medium"
          onClick={onReset}>
          Reset
        </Button>
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
                title: <a href="">Schrodinger</a>,
              },
              {
                title: <div>{mockData.symbol}</div>,
              },
            ]}
          />
          <div className="w-full h-[68px] mt-[40px] flex flex-row justify-between">
            <DetailTitle />
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
            <ItemImage />
            <ItemInfo />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1360px] flex flex-col items-center">
          <div className="w-full flex flex-row justify-start items-center">
            <ArrowSVG className="!size-4" />
            <div className="ml-[8px] font-semibold text-sm w-full">Back</div>
          </div>
          <div className="mt-[16px]" />
          <DetailTitle />
          <ItemImage />
          <Button
            type="default"
            className="!rounded-lg !border-[#3888FF] !text-[#3888FF] h-[48px] w-full mt-[16px]"
            size="medium"
            onClick={onTrade}>
            Trade
          </Button>
          <ItemInfo />
          {adoptAndResetButtonSamll()}
        </div>
      )}
    </section>
  );
}
