import styles from '../style.module.css';
import React from 'react';
import { ReactComponent as InviteSVG } from 'assets/img/invite.svg';

function InviteItem({ checkAndRedirect }: { checkAndRedirect: (path: string) => void }) {
  return (
    <div className={styles.menuItem} onClick={() => checkAndRedirect('/referral')}>
      <InviteSVG />
      <span>Invite Friends</span>
    </div>
  );
}

export default React.memo(InviteItem);
