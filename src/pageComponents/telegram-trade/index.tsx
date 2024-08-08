import { Collection } from 'forest-ui-react';
import 'forest-ui-react/dist/assets/index.css';
import { useSearchParams } from 'next/navigation';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';

export default function TradePage() {
  const searchParams = useSearchParams();
  const cId = searchParams.get('cId') || '';

  return (
    <div>
      <BackCom className="py-4 px-4" />
      <Collection nftCollectionId={cId} />
    </div>
  );
}
