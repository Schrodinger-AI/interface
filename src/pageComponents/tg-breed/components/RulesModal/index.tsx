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
          <h2>🌟 S-CAT $3,000+ Jackpot {cmsInfo?.winningCatSeason || 'Season 1'} is LIVE! 🌟</h2>
          <h4>
            🎉 $3000 SGR & an ever-growing Bonus Prize is up for grabs. ONE winner takes it ALL! Level up by adopting
            cats and merging them into the rare {cmsInfo?.winningCatLevel || 'Gold III'}. The chase is on: the first to
            own {cmsInfo?.winningCatLevel || 'Gold III'} wins the entire Jackpot! 💰
          </h4>
          <h3>🗓 Event Duration:</h3>
          <h4>{cmsInfo?.mergeActivityTime || 'Nov 14th - Dec 14th'}. Each week is a new &quot;Round&quot;!</h4>
          <h3>💵 Jackpot:</h3>
          <p>
            Every round offers a 3,000 $SGR Basic Prize plus an ever-growing <b>Bonus Prize</b> that increases with
            every cat adoption & Merge.
          </p>
          <h3>💎 Bonus Prize:</h3>
          <ol>
            <li>
              <p>Each SGR cat adoption adds up to 0.55 SGR to the Bonus Prize</p>
            </li>
            <li>
              <p>Each S-CAT voucher cat adoption adds 0.25 SGR to the Bonus Prize</p>
            </li>
            <li>
              <p>Each Merge adds 0.25 SGR to the Bonus Prize</p>
            </li>
            <li>
              <p>
                If no {cmsInfo?.winningCatLevel || 'Gold III'} emerges, 80% of the jackpot difference each round will
                carry over to the next round&apos;s jackpot, keeping the stakes high and your pulse higher!
              </p>
            </li>
          </ol>
          <h3>🐱 SGR Adoption Rebate:</h3>
          <p>
            Users are charged 1.6 SGR to adopt a cat and have a 98% chance of receiving a rebate between 0 to 1.3 SGR,
            making the net cost ranging from 0.3 SGR to 1.6 SGR.
          </p>
          <ol>
            <li>
              <p>For adoption spending between 0.3 SGR and 0.5 SGR, no SGR goes to the Bonus Prize.</p>
            </li>
            <li>
              <p>For adoption spending over 0.5 SGR, half of the excess goes to the Bonus Prize.</p>
            </li>
          </ol>
          <h3>🧪 Interim Prize:</h3>
          <p>
            20% of the jackpot difference each round will form an Interim Prize, distributed after Season 2 ends.
            Allocations are 60% to Gold II, 30% to Gold III, 8% to Gold IV, and 2% to a lucky SGR cat adopter.
          </p>
          <h3>🧪 Cat Merge:</h3>
          <p>
            Two cats of the same rarity can be merged to a higher rarity. Each merge has a chance of failure, ramping up
            the suspense as each Merge contributes SGR to the growing Prize Pool!
          </p>
          <h3>🔄 Reroll:</h3>
          <p>The reroll will burn the NFT and the owner will receive 0.5 SGR in return.</p>
          <h3>🔑 Prize Distribution:</h3>
          <p>
            - The first to hit the &quot;Redeem&quot; button with a {cmsInfo?.winningCatLevel || 'Gold III'} cat can
            claim the jackpot! The {cmsInfo?.winningCatLevel || 'Gold III'} NFT will then be burnt.
          </p>
          <p>
            - The Interim Prize will be converted from SGR to ELF, and bid on the Forest marketplace, with Gold II, III,
            IV holders having one month to accept bids and complete the reward process.
          </p>
          <h4 className="!mt-[16px]">
            🐱 Join the game and merge wisely — your path to take home the entire Jackpot is just a merge away! 👑
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
