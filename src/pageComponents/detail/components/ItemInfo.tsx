import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import { ISGRDetailTrait } from '../types';
import { TSGRToken } from 'types/tokens';

export default function ItemInfo({
  detail,
  onAdoptNextGeneration,
}: {
  detail: TSGRToken;
  onAdoptNextGeneration: () => void;
}) {
  const traits = () => {
    const rowTraits = [];
    const rowNum = 3;
    for (let i = 0; i < detail.traits.length; i += rowNum) {
      const chunk = detail.traits.slice(i, i + rowNum);
      rowTraits.push(chunk);
    }
    const rowRrait = (traits: ISGRDetailTrait[]) => (
      <div className="mb-[16px] flex flex-col lg:flex-row justify-between">
        {traits.map((item) => (
          <>
            <div
              key={item.traitType}
              className="w-[198px] p-[24px] hidden lg:flex flex-col items-center bg-[#FAFAFA] rounded-lg">
              <div className="text-[#919191] font-medium text-sm">{item.traitType}</div>
              <div className="mt-[8px] text-[#1A1A1A] font-medium text-xl">{item.value}</div>
              <div className="mt-[8px] text-[#919191] font-medium text-base">{item.percent}%</div>
            </div>
            <div
              key={item.traitType}
              className="w-full px-[24px] pt-[16px] flex lg:hidden flex-col h-[90px] mt-[16px] bg-[#FAFAFA] rounded-lg	">
              <div className="text-[#919191] font-medium text-sm">{item.traitType}</div>
              <div className="flex flex-row w-full justify-between">
                <div className="mt-[8px] text-[#1A1A1A] font-medium text-xl">{item.value}</div>
                <div className="mt-[8px] text-[#919191] font-medium text-base">{item.percent}%</div>
              </div>
            </div>
          </>
        ))}
      </div>
    );
    return <div className="w-full flex flex-col justify-center">{rowTraits.map((item) => rowRrait(item))}</div>;
  };

  const noTraits = () => {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <div className="text-[#919191] font-medium	text-lg text-center mt-[10px]">
          Seems like this is a gen0 kitten with no traits. <br />
          Take this kitten to the next level by adopting a next-gen cat, <br />
          generating brand new and unpredictable traits.
        </div>
        <Button
          type="primary"
          className="!rounded-lg  bg-[#3888FF] !text-[#FFFFFF] mr-[12px] mt-[24px] mb-[56px] w-[239px]"
          size="large"
          onClick={onAdoptNextGeneration}>
          Adopt Next-Gen Cat
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full lg:max-w-[660px] lg:min-w-[452px] mt-[16px] lg:mt-[0px]">
      <div className="w-full h-[72px] rounded-2xl border-solid border border-[#E1E1E1] flex flex-row justify-between items-center px-[24px]">
        <div className="text-[#1A1A1A] font-medium	text-lg">Item Generation</div>
        <div className="text-[#919191] font-medium	text-lg">{detail.generation}</div>
      </div>
      <div className="w-full rounded-2xl border-solid border border-[#E1E1E1] flex flex-col px-[16px] mt-[16px]">
        <div className="ml-[8px] w-full h-[72px] flex flex-row justify-between items-center">
          <div className="text-[#1A1A1A] font-medium	text-lg">Traits</div>
          <ArrowSVG className={clsx('size-4', 'mr-[16px]', { ['common-revert-180']: true })} />
        </div>
        {detail.generation == 0 ? noTraits() : traits()}
      </div>
    </div>
  );
}
