import styles from '../style.module.css';
import React from 'react';
import { ReactComponent as PointsSVG } from 'assets/img/points.svg';

function ReferralItem({ checkAndRedirect }: { checkAndRedirect: (path: string) => void }) {
  return (
    <div className={styles.menuItem} onClick={() => checkAndRedirect('/referral')}>
      <PointsSVG />
      <span>My Referral</span>
    </div>
  );
}

export default React.memo(ReferralItem);
