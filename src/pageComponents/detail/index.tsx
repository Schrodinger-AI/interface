import mockData from './mock.json';
import { Button } from 'aelf-design';
import DetailTitle from './components/DetailTitle';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';

export default function DetailPage() {
  const detailData = mockData;

  const onAdoptNextGeneration = () => {
    // todo
  };

  const onReset = () => {
    // todo
  };

  const onTrade = () => {
    // todo
  };

  return (
    <div className="w-full max-w-[1360px] mt-[48px]">
      <div className="font-semibold text-2xl">Schrodinger SGR-2GEN1</div>
      <div className="w-full h-[68px] mt-[40px] flex flex-row justify-between">
        <DetailTitle />
        <div className="h-full flex flex-row items-end">
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
  );
}
