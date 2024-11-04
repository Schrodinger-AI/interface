import styles from '../style.module.css';
import { ReactComponent as WithdrawSVG } from 'assets/img/withdraw.svg';
import { SELL_ELF_URL } from 'constants/router';
import React from 'react';

function WithdrawItem({ checkAndRedirect }: { checkAndRedirect: (path: string) => void }) {
  return (
    <div className={styles.menuItem} onClick={() => checkAndRedirect(SELL_ELF_URL)}>
      <WithdrawSVG />
      <span>Withdraw</span>
    </div>
  );
}

export default React.memo(WithdrawItem);
