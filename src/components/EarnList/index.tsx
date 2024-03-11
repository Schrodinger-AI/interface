interface IPointDetail {
  action: string;
  symbol: string;
  amount: number;
}

interface ITokenEarnListProps {
  dataSource: Array<IPointDetail>;
}

function PointListItem({ action, symbol, amount }: IPointDetail) {
  return (
    <div className="flex items-center justify-between py-4 md:py-7 gap-x-8 border-0 border-b border-solid border-neutralBorder">
      <span className=" flex-1 text-neutralSecondary break-all">{action}</span>
      <span className=" font-medium text-neutralPrimary">
        {amount} {symbol}
      </span>
    </div>
  );
}

export function TokenEarnList({ dataSource }: ITokenEarnListProps) {
  if (!dataSource?.length) return null;
  return (
    <div>
      {dataSource.map((pointDetail) => (
        <PointListItem {...pointDetail} key={pointDetail.action}></PointListItem>
      ))}
    </div>
  );
}
