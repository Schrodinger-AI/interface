import styles from '../style.module.css';
import { ReactComponent as WalletSVG } from 'assets/img/wallet.svg';
import { SELL_ELF_URL } from 'constants/router';
import React from 'react';

function WithdrawItem({ checkAndRedirect }: { checkAndRedirect: (path: string) => void }) {
  return (
    <div className={styles.menuItem} onClick={() => checkAndRedirect(SELL_ELF_URL)}>
      <WalletSVG />
      <span>Withdraw</span>
    </div>
  );
}

export default React.memo(WithdrawItem);
