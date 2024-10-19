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
import { fetchVoteInfo } from 'api/request';
import { IVoteInfo } from 'redux/types/reducerTypes';
import useIsInActivity from './hooks/useIsInActivity';
import Rules from './components/Rules';
import { useCmsInfo } from 'redux/hooks';

export default function TgHome() {
  const router = useRouter();
  const { walletInfo } = useConnectWallet();
  const { schrodingerDetail } = useGetStoreInfo();
  const { refresh } = useBalanceService();
  const { checkBalanceAndJump } = useBuyToken();
  const adoptHandler = useAdoptHandler();
  const isActivity = useIsInActivity();
  const cmsInfo = useCmsInfo();
  const purchaseMethodModal = useModal(PurchaseMethodModal);

  const [isOpen, setIsOpen] = useState(false);
  const [voteCountdown, setVoteCountdown] = useState<number>(0);
  const [voteInfo, setVoteInfo] = useState<IVoteInfo['votes']>([]);

  const updateVoteInfo = useCallback(
    (faction?: string) => {
      console.log('=====updateVoteInfo', faction, cmsInfo?.prevSide);
      if (faction === cmsInfo?.prevSide) {
        setVoteInfo((voteInfo) => {
          return [voteInfo[0], ++voteInfo[1]];
        });
      } else {
        setVoteInfo((voteInfo) => {
          return [++voteInfo[0], voteInfo[1]];
        });
      }
    },
    [cmsInfo?.prevSide],
  );

  const getBalance = useCallback(async () => {
    const res = await refresh();
    return res;
  }, [refresh]);

  const OpenAdoptModal = useCallback(
    async (faction: string) => {
      if (!isActivity) {
        router.back();
        return;
      }
      const res = await getBalance();
      console.log('=====sgrBalance', res);
      if (!walletInfo?.address || !schrodingerDetail) return;
      if (divDecimals(res?.sgrBalance, 8).lt(DIRECT_ADOPT_GEN9_MIN)) {
        const description = `Insufficient funds, need more $SGR. The cat adoption costs ${DIRECT_ADOPT_GEN9_MIN} $SGR minimum. `;
        if (divDecimals(res?.elfBalance, 8).gt(0)) {
          checkBalanceAndJump({
            type: 'buySGR',
            theme: 'dark',
            defaultDescription: [description],
          });
        } else {
          purchaseMethodModal.show({
            type: 'buySGR',
            theme: 'dark',
            sgrBalance: formatTokenPrice(res?.sgrBalance || 0),
            elfBalance: formatTokenPrice(res?.elfBalance || 0),
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
      updateVoteInfo(faction);
    },
    [
      isActivity,
      getBalance,
      walletInfo?.address,
      schrodingerDetail,
      adoptHandler,
      updateVoteInfo,
      router,
      checkBalanceAndJump,
      purchaseMethodModal,
    ],
  );

  const getVoteDetail = useCallback(async () => {
    try {
      const res = await fetchVoteInfo();
      setVoteCountdown(res.countdown);
      setVoteInfo(res.votes);
    } catch (error) {
      /* empty */
    }
  }, []);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    getVoteDetail();
  }, [getVoteDetail]);

  useEffect(() => {
    if (!schrodingerDetail) {
      router.back();
    }
  }, [router, schrodingerDetail]);

  return (
    <div className={clsx('max-w-[2560px] w-full min-h-screen p-[16px] bg-battaleBg')}>
      <BackCom className="w-full mb-[16px]" theme="dark" />

      <HeaderModule countdown={voteCountdown || 0} showRules={() => setIsOpen(true)} />

      <CompareModule data={voteInfo || []} />

      <AdoptModule onAdopt={OpenAdoptModal} />

      <TgModal
        title="Activities Rules"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <Rules />
      </TgModal>
    </div>
  );
}
