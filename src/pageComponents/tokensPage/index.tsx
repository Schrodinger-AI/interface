'use client';
import TokensInfo from './components/TokensInfo';
import OwnedItems from './components/OwnedItems';
import TokensHome from './components/TokensHome';
import styles from './styles.module.css';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

export default function TokensPage() {
  const { isLogin } = useGetLoginStatus();

  return (
    <>
      {!isLogin ? (
        <TokensHome />
      ) : (
        <div className={styles.tokensPageContainer}>
          <TokensInfo />
          <OwnedItems />
        </div>
      )}
    </>
  );
}
