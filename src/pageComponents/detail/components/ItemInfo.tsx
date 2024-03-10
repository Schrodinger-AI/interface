import mockData from '../mock.json';

export default function ItemInfo() {
  return (
    <div className="flex flex-col w-[660px]">
      <div className="w-full h-[72px] rounded-2xl border-solid border border-[#E1E1E1] flex flex-row justify-between items-center px-[24px]">
        <div className="text-[#1A1A1A] font-medium	text-lg">Item Generation</div>
        <div className="text-[#919191)] font-medium	text-lg">{mockData.generationDesc}</div>
      </div>
      <div className="w-full rounded-2xl border-solid border border-[#E1E1E1] flex flex-col px-[16px] mt-[16px]">
        <div className="ml-[8px] w-full h-[72px] flex flex-row justify-between items-center">
          <div className="text-[#1A1A1A] font-medium	text-lg">Trait</div>
        </div>
        <div className="mb-[16px] flex flex-row justify-between">
          {mockData.traits.map((item) => (
            <div key={item.traitType} className="w-[198px] p-[24px] flex flex-col items-center">
              <div className="text-[#919191] font-medium text-sm">{item.traitType}</div>
              <div className="mt-[8px] text-[#1A1A1A] font-medium text-xl">{item.value}</div>
              <div className="mt-[8px] text-[#919191] font-medium text-base">{item.percent}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
