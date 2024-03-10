import mockData from '../mock.json';

export default function DetailPage() {
  return (
    <div className="h-ful flex">
      <div className="h-full flex flex-col justify-between">
        <div className="text-[#B8B8B8] text-xl font-medium">{mockData.name}</div>
        <div className="text-[#1A1A1A] text-base font-semibold">{mockData.symbol}</div>
      </div>
      <div className="ml-[68px] h-full flex flex-col justify-between">
        <div className="text-[#B8B8B8] text-xl font-medium">Owned item amount</div>
        <div className="text-[#1A1A1A] text-base font-semibold">{mockData.amount}</div>
      </div>
    </div>
  );
}
