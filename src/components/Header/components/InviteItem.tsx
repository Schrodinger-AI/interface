import styles from '../style.module.css';
import React from 'react';
import { ReactComponent as InviteSVG } from 'assets/img/invite.svg';
import { useJoinStatus } from 'redux/hooks';

function InviteItem({ checkAndRedirect }: { checkAndRedirect: (path: string) => void }) {
  const isJoin = useJoinStatus();

  if (!isJoin) return null;

  return (
    <div className={styles.menuItem} onClick={() => checkAndRedirect('/referral')}>
      <InviteSVG />
      <span>Invite Friends</span>
    </div>
  );
}

export default React.memo(InviteItem);
