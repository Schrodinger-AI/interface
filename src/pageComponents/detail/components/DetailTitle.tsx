import mockData from '../mock.json';

export default function DetailTitle() {
  return (
    <div className="h-[58px] lg:h-[68px] w-full lg:w-auto flex justify-between lg:justify-start">
      <div className="h-full flex flex-col justify-between">
        <div className="text-[#B8B8B8] text-sm	lg:text-xl font-medium">{mockData.name}</div>
        <div className="text-[#1A1A1A] text-xl lg:text-2xl font-semibold">{mockData.symbol}</div>
      </div>
      <div className="ml-[68px] h-full flex flex-col justify-between">
        <div className="text-[#B8B8B8] text-sm	lg:text-xl font-medium">Owned item amount</div>
        <div className="text-[#1A1A1A] text-xl lg:text-2xl	 font-semibold text-right lg:text-left">
          {mockData.amount}
        </div>
      </div>
    </div>
  );
}
