'use client';

import TgModal from 'components/TgModal';
import styles from './index.module.css';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';
import { useCmsInfo } from 'redux/hooks';

function RulesModal({ theme }: { theme?: TModalTheme }) {
  const modal = useModal();
  const cmsInfo = useCmsInfo();
  const modalContent = () => {
    return (
      <div className={clsx(styles.rules, theme === 'dark' ? styles['dark-rules'] : '')}>
        <div>
          <h2>🌟 S-CAT $1,000+ Cat Merge Event Season 1 is LIVE! 🌟</h2>
          <h4>
            🎉 $1,000 SGR + an ever-growing Bonus Prize is up for grabs. ONE winner takes it ALL! Level up by adopting
            cats and merging them into the rare {cmsInfo?.winningCatLevel || 'Gold III'} . The chase is on: the first to
            own {cmsInfo?.winningCatLevel || 'Gold III'} wins the entire Prize Pool! 💰
          </h4>
          <h3>🗓 Event Duration:</h3>
          <h4>{cmsInfo?.mergeActivityTime || 'Nov 14th - Dec 14th'}. Each week is a new &quot;Round&quot;!</h4>
          <h3>💵 Prize Pool:</h3>
          <p>
            Every round offers 1,000 $SGR Basic Prize Pool plus an ever-growing Bonus Prize that increases with every
            cat adoption & merge.
          </p>
          <h3>💎 Bonus Prize:</h3>
          <ol>
            <li>
              <p>Each cat adoption with SGR adds 0.55 SGR to the Bonus Prize Pool</p>
            </li>
            <li>
              <p>Each cat adoption with S-CAT vouchers adds 0.25 SGR to the Bonus Prize Pool</p>
            </li>
            <li>
              <p>Each Merge adds 0.25 SGR to the Bonus Prize Pool</p>
            </li>
            <li>
              <p>
                If no {cmsInfo?.winningCatLevel || 'Gold III'} emerges by week&apos;s end, 80% of the Bonus Prize Pool
                will roll into the next round&apos;s Prize Pool, keeping the stakes high and your pulse higher!
              </p>
            </li>
          </ol>
          <h3>🧪 Cat Merge:</h3>
          <p>
            Two cats of the same rarity can be merged to a higher rarity. Each merge has a chance of failure, ramping up
            the suspense as each Merge contributes SGR to the growing Prize Pool!
          </p>
          <h3>🔄 Reroll Update:</h3>
          <p>The reroll will burn the NFT and the owner will receive 0.5 SGR in return.</p>
          <h3>🔑 Prize Distribution:</h3>
          <p>
            The first to hit the &quot;Redeem&quot; button with a {cmsInfo?.winningCatLevel || 'Gold III'} cat can claim
            the entire prize pool! The {cmsInfo?.winningCatLevel || 'Gold III'} NFT will then be burnt.
          </p>
          <h4 className="!mt-[16px]">
            🐱 Join the game and merge wisely —your path to take home the entire Prize is just a merge away! 👑
          </h4>
        </div>
      </div>
    );
  };
  if (theme === 'dark') {
    return (
      <TgModal
        title="Rules"
        open={modal.visible}
        hideHeader={false}
        onOk={modal.hide}
        onCancel={modal.hide}
        afterClose={modal.remove}>
        {modalContent()}
      </TgModal>
    );
  } else {
    return (
      <CommonModal
        title="Rules"
        open={modal.visible}
        hideHeader={false}
        onOk={modal.hide}
        disableMobileLayout={true}
        onCancel={modal.hide}
        theme="light"
        afterClose={modal.remove}>
        {modalContent()}
      </CommonModal>
    );
  }
}

export default NiceModal.create(RulesModal);
