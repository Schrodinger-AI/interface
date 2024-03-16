export interface ISGRTokenInfoProps {
  tokenName?: string;
  symbol?: string;
  amount?: string | number;
}

export default function SGRTokenInfo({ tokenName, symbol, amount }: ISGRTokenInfoProps) {
  return (
    <div className="text-base text-[#919191]">
      <div className="flex justify-between">
        <span>{symbol ?? '--'}</span>
        <span>Owned Amount</span>
      </div>
      <div className="flex justify-between text-[#1A1A1A]">
        <span className="text-lg font-semibold">{tokenName ?? '--'}</span>
        <span className="font-medium">{amount ?? '--'}</span>
      </div>
    </div>
  );
}
