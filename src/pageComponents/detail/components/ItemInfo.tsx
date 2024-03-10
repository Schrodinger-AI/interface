import mockData from '../mock.json';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useResponsive } from 'ahooks';

export default function ItemInfo() {
  const responsive = useResponsive();

  const onLearnMore = () => {
    alert('onLearnMore');
  };

  return (
    <div className="flex flex-col w-full lg:w-[660px] mt-[16px] lg:mt-[0px]">
      <div className="w-full h-[72px] rounded-2xl border-solid border border-[#E1E1E1] flex flex-row justify-between items-center px-[24px]">
        <div className="text-[#1A1A1A] font-medium	text-lg">Item Generation</div>
        <div className="text-[#919191] font-medium	text-lg">{mockData.generationDesc}</div>
      </div>
      <div className="w-full rounded-2xl border-solid border border-[#E1E1E1] flex flex-col px-[16px] mt-[16px]">
        <div className="ml-[8px] w-full h-[72px] flex flex-row justify-between items-center">
          <div className="text-[#1A1A1A] font-medium	text-lg">Trait</div>
          <ArrowSVG className="!size-4 mr-[16px]" />
        </div>
        <div className="mb-[16px] flex flex-col lg:flex-row justify-between">
          {mockData.traits.map((item) =>
            responsive.lg ? (
              <div key={item.traitType} className="w-[198px] p-[24px] flex flex-col items-center">
                <div className="text-[#919191] font-medium text-sm">{item.traitType}</div>
                <div className="mt-[8px] text-[#1A1A1A] font-medium text-xl">{item.value}</div>
                <div className="mt-[8px] text-[#919191] font-medium text-base">{item.percent}%</div>
              </div>
            ) : (
              <div key={item.traitType} className="w-full px-[24px] pt-[16px] flex flex-col h-[90px] mt-[16px]">
                <div className="text-[#919191] font-medium text-sm">{item.traitType}</div>
                <div className="flex flex-row w-full justify-between">
                  <div className="mt-[8px] text-[#1A1A1A] font-medium text-xl">{item.value}</div>
                  <div className="mt-[8px] text-[#919191] font-medium text-base">{item.percent}%</div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <div className="w-full flex flex-row justify-end items-center mt-[16px] mb-[24px] h-[24px]" onClick={onLearnMore}>
        <div className="text-[#1A1A1A] text-base mr-[8px]">Learn more</div>
        <div className="w-[24px] h-[24px] flex justify-center items-center">
          <ArrowSVG className="!size-4" />
        </div>
      </div>
    </div>
  );
}
