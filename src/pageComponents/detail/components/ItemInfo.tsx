import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { ISGRDetailRes } from '../types';
import { useResponsive } from 'ahooks';
import { Button } from 'aelf-design';

export default function ItemInfo({
  detail,
  onAdoptNextGeneration,
}: {
  detail: ISGRDetailRes;
  onAdoptNextGeneration: () => void;
}) {
  const responsive = useResponsive();

  const traits = () => {
    return (
      <div className="mb-[16px] flex flex-col lg:flex-row justify-between">
        {detail.traits.map((item) =>
          responsive.lg ? (
            <div key={item.traitType} className="w-[198px] p-[24px] flex flex-col items-center bg-[#FAFAFA] rounded-lg	">
              <div className="text-[#919191] font-medium text-sm">{item.traitType}</div>
              <div className="mt-[8px] text-[#1A1A1A] font-medium text-xl">{item.value}</div>
              <div className="mt-[8px] text-[#919191] font-medium text-base">{item.percent}%</div>
            </div>
          ) : (
            <div
              key={item.traitType}
              className="w-full px-[24px] pt-[16px] flex flex-col h-[90px] mt-[16px] bg-[#FAFAFA] rounded-lg	">
              <div className="text-[#919191] font-medium text-sm">{item.traitType}</div>
              <div className="flex flex-row w-full justify-between">
                <div className="mt-[8px] text-[#1A1A1A] font-medium text-xl">{item.value}</div>
                <div className="mt-[8px] text-[#919191] font-medium text-base">{item.percent}%</div>
              </div>
            </div>
          ),
        )}
      </div>
    );
  };

  const noTraits = () => {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <div className="text-[#919191] font-medium	text-lg text-center mt-[10px]">
          wops ! Your cat has no traits! <br />
          Adopt your next genration CAT now!
        </div>
        <Button
          type="primary"
          className="!rounded-lg  bg-[#3888FF] !text-[#FFFFFF] mr-[12px] mt-[24px] mb-[56px] w-[239px]"
          size="medium"
          onClick={onAdoptNextGeneration}>
          Adopt Next Generation
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full lg:w-[660px] mt-[16px] lg:mt-[0px]">
      <div className="w-full h-[72px] rounded-2xl border-solid border border-[#E1E1E1] flex flex-row justify-between items-center px-[24px]">
        <div className="text-[#1A1A1A] font-medium	text-lg">Item Generation</div>
        <div className="text-[#919191] font-medium	text-lg">{detail.generationDesc}</div>
      </div>
      <div className="w-full rounded-2xl border-solid border border-[#E1E1E1] flex flex-col px-[16px] mt-[16px]">
        <div className="ml-[8px] w-full h-[72px] flex flex-row justify-between items-center">
          <div className="text-[#1A1A1A] font-medium	text-lg">Traits</div>
          <ArrowSVG className="!size-4 mr-[16px]" />
        </div>
        {detail.generation == 0 ? noTraits() : traits()}
      </div>
    </div>
  );
}
