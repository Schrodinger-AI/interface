import { Collection } from 'forest-ui-react';
import 'forest-ui-react/dist/assets/index.css';
import { useSearchParams } from 'next/navigation';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import styles from './style.module.css';
import clsx from 'clsx';
import './style.css';

export default function TradePage() {
  const searchParams = useSearchParams();
  const cId = searchParams.get('cId') || '';

  return (
    <div className={clsx(styles['forest-trade'])}>
      <BackCom className="py-4 px-4" theme="dark" />
      <Collection nftCollectionId={cId} />
    </div>
  );
}
