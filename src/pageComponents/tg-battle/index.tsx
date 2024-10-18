'use client';

import clsx from 'clsx';
import HeaderModule from './components/HeaderModule';
import CompareModule from './components/CompareModule';
import AdoptModule from './components/AdoptModule';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import useBalanceService from 'pageComponents/tg-home/hooks/useBalanceService';
import { divDecimals } from 'utils/calculate';
import { DIRECT_ADOPT_GEN9_MIN } from 'constants/common';
import { useBuyToken } from 'hooks/useBuyToken';
import { formatTokenPrice } from 'utils/format';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useModal } from '@ebay/nice-modal-react';
import PurchaseMethodModal from 'components/PurchaseMethodModal';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import TgModal from 'components/TgModal';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export default function TgHome() {
  const router = useRouter();
  const { walletInfo } = useConnectWallet();
  const { schrodingerDetail, voteInfo } = useGetStoreInfo();
  const { refresh } = useBalanceService();
  const { checkBalanceAndJump } = useBuyToken();
  const adoptHandler = useAdoptHandler();
  const purchaseMethodModal = useModal(PurchaseMethodModal);

  const [sgrBalance, setSgrBalance] = useState('0');
  const [elfBalance, setElfBalance] = useState('0');
  const [isOpen, setIsOpen] = useState(false);

  const OpenAdoptModal = useCallback(
    (faction: string) => {
      if (voteInfo?.countdown && voteInfo?.countdown > 0) {
        router.back();
        return;
      }
      if (!walletInfo?.address || !schrodingerDetail) return;
      if (divDecimals(sgrBalance, 8).lt(DIRECT_ADOPT_GEN9_MIN)) {
        const description = `Insufficient funds, need more $SGR. The cat adoption costs ${DIRECT_ADOPT_GEN9_MIN} $SGR minimum. `;
        if (divDecimals(elfBalance, 8).gt(0)) {
          checkBalanceAndJump({
            type: 'buySGR',
            theme: 'dark',
            defaultDescription: [description],
          });
        } else {
          purchaseMethodModal.show({
            type: 'buySGR',
            theme: 'dark',
            sgrBalance: formatTokenPrice(sgrBalance),
            elfBalance: formatTokenPrice(elfBalance),
            hideSwap: true,
            hideTutorial: true,
            defaultDescription: [description],
          });
        }

        return;
      }
      adoptHandler({
        parentItemInfo: schrodingerDetail,
        account: walletInfo?.address,
        isDirect: true,
        theme: 'dark',
        prePage: 'adoptModal',
        faction,
        hideInputModal: true,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      adoptHandler,
      checkBalanceAndJump,
      elfBalance,
      purchaseMethodModal,
      schrodingerDetail,
      sgrBalance,
      walletInfo?.address,
      voteInfo?.countdown,
    ],
  );

  const getBalance = useCallback(async () => {
    const res = await refresh();
    if (res) {
      const { sgrBalance, elfBalance } = res;
      setSgrBalance(sgrBalance || '0');
      setElfBalance(elfBalance || '0');
    }
  }, [refresh]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <div className={clsx('max-w-[2560px] w-full min-h-screen p-[16px] bg-battaleBg')}>
      <BackCom className="w-full mb-[16px]" theme="dark" />

      <HeaderModule countdown={voteInfo?.countdown || 1000} showRules={() => setIsOpen(true)} />

      <CompareModule data={voteInfo?.votes || []} />

      <AdoptModule onAdopt={OpenAdoptModal} />

      <TgModal
        title="Activities Rules"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div>
          <h4 className="text-rarityOrange text-[16px] leading-[24px] font-bold">
            Duration: <br />
            15 Days (Ends on November 5th)
          </h4>
          <h4 className="mt-[16px] mb-[8px] text-rarityOrange text-[16px] leading-[24px] font-bold">Event Details:</h4>
          <ul className="list-decimal ml-[24px]">
            <li className="text-pixelsLightPurple">
              Recharge Reward
              <p className="text-pixelsLighterPurple text-[14px] leading-[24px]">
                Recharge $10 to get 1 Cat Draw and a chance to share a $40 daily prize pool.
              </p>
            </li>
            <li className="text-pixelsLightPurple">
              Daily Draw
              <p className="text-pixelsLighterPurple text-[14px] leading-[24px]">
                Get 1 free draw each day to share a $20 daily prize pool.
              </p>
            </li>
            <li className="text-pixelsLightPurple">
              Team Competition Rewards
              <p className="text-pixelsLighterPurple text-[14px] leading-[24px]">
                Winning team&apos;s tagged cats share $800.
              </p>
              <p className="text-pixelsLighterPurple text-[14px] leading-[24px]">
                Losing team&apos;s tagged cats share $300.
              </p>
            </li>
          </ul>
          <h4 className="mt-[16px] mb-[8px] text-rarityOrange text-[16px] leading-[24px] font-bold">
            How to Participate:
          </h4>
          <ol className="list-disc ml-[24px]">
            <li className="text-pixelsLighterPurple text-[14px] leading-[24px]">
              Each Cat Draw allows you to vote for a team: [Team Trump] or [Team Harris].
            </li>
            <li className="text-pixelsLighterPurple text-[14px] leading-[24px]">
              The voting page will display a real-time countdown and current standings.
            </li>
            <li className="text-pixelsLighterPurple text-[14px] leading-[24px]">
              Only cats with team tags are eligible to share the $1,100 reward
            </li>
          </ol>
          <section>
            <h4 className="mt-[16px] mb-[8px] text-rarityOrange text-[16px] leading-[24px] font-bold">
              Winning Conditions:
            </h4>
            <p className="text-pixelsLighterPurple text-[14px] leading-[24px]">
              If [Team Trump] leads in votes, [Trump] tagged cats share $800, and [Harris] tagged cats share $300;
              andviceversa.
            </p>
          </section>
        </div>
      </TgModal>
    </div>
  );
}
