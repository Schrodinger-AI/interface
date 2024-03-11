import { EarnAmountCount } from './utils/calculateAmount';

interface ITokenEarnListProps {
  dataSource: Array<IPointItem>;
}

function PointListItem({ data }: { data: IPointItem }) {
  const { displayName, symbol } = data;
  return (
    <div className="flex items-center justify-between py-4 md:py-7 gap-x-8 text-[16px] leading-[24px] font-normal border-0 border-b border-solid border-[#EDEDED]">
      <span className="flex-1 text-[#919191] break-all">{displayName}</span>
      <span className="font-medium text-[#434343]">
        {EarnAmountCount({ ...data, followersNumber: 1 })} {symbol}
      </span>
    </div>
  );
}

export function TokenEarnList({ dataSource }: ITokenEarnListProps) {
  if (!dataSource?.length) return null;
  return (
    <div>
      {dataSource.map((pointDetail) => (
        <PointListItem key={pointDetail.action} data={pointDetail}></PointListItem>
      ))}
    </div>
  );
}
