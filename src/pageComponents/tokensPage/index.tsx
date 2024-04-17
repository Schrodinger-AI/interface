'use client';
import TokensInfo from './components/TokensInfo';
import OwnedItems from './components/OwnedItems';
import styles from './styles.module.css';

export default function TokensPage() {
  return (
    <div className={styles.tokensPageContainer}>
      <TokensInfo />
      <OwnedItems />
    </div>
  );
}
