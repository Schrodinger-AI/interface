interface IProps {
  // TODO: number precision
  fee: number;
  usd: number;
}

export default function TransactionFee({ fee, usd }: IProps) {
  return (
    <div className="text-base">
      <div className="flex justify-between">
        <span className="text-[#919191]">Transaction Fee</span>
        <span className="font-medium">{fee} ELF</span>
      </div>
      <div className="flex justify-end">
        <span className="text-[#919191]">$ {usd}</span>
      </div>
    </div>
  );
}
