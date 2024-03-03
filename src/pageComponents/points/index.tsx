import { TokenEarnList } from 'components/EarnList';

export default function PointsPage() {
  return (
    <div className="w-full max-w-[1360px]">
      <h1 className="py-[12px] font-semibold text-2xl">Details of points earned</h1>
      <TokenEarnList dataSource={[]} />
    </div>
  );
}
