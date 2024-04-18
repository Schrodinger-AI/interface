'use client';
import TokensInfo from './components/TokensInfo';
import OwnedItems from './components/OwnedItems';
import styles from './styles.module.css';
import { useTimeoutFn } from 'react-use';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';

export default function MyCats() {
  const router = useRouter();
  const { checkTokenValid } = useCheckLoginAndToken();
  const { isLogin } = useWalletService();

  useTimeoutFn(() => {
    if (!isLogin && !checkTokenValid()) {
      router.push('/');
    }
  }, 3000);

  return (
    <div className={styles.tokensPageContainer}>
      <TokensInfo />
      <OwnedItems />
    </div>
  );
}
