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
import { useCmsInfo } from 'redux/hooks';
import styles from './index.module.css';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import dayjs from 'dayjs';
import { fetchVoteInfo } from 'api/request';
import { IVoteInfo } from 'redux/types/reducerTypes';

export default function TgHome() {
  const router = useRouter();
  const { walletInfo } = useConnectWallet();
  const { schrodingerDetail } = useGetStoreInfo();
  const { refresh } = useBalanceService();
  const { checkBalanceAndJump } = useBuyToken();
  const adoptHandler = useAdoptHandler();
  const cmsInfo = useCmsInfo();
  const voteRules = cmsInfo?.voteRules;
  const startTime = dayjs(cmsInfo?.voteActivityStartTime || '').valueOf();
  const endTime = dayjs(cmsInfo?.voteActivityEndTime || '').valueOf();
  const purchaseMethodModal = useModal(PurchaseMethodModal);

  const [sgrBalance, setSgrBalance] = useState('0');
  const [elfBalance, setElfBalance] = useState('0');
  const [isOpen, setIsOpen] = useState(false);
  const [voteInfo, setVoteInfo] = useState<IVoteInfo>({
    countdown: 0,
    votes: [],
  });

  const OpenAdoptModal = useCallback(
    (faction: string) => {
      const now = Date.now();
      const isActivity = now >= startTime && now <= endTime;
      if (!isActivity) {
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

  const getVoteDetail = useCallback(async () => {
    try {
      const res = await fetchVoteInfo();
      setVoteInfo(res);
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

  return (
    <div className={clsx('max-w-[2560px] w-full min-h-screen p-[16px] bg-battaleBg')}>
      <BackCom className="w-full mb-[16px]" theme="dark" />

      <HeaderModule countdown={voteInfo?.countdown || 0} showRules={() => setIsOpen(true)} />

      <CompareModule data={voteInfo?.votes || []} />

      <AdoptModule onAdopt={OpenAdoptModal} />

      <TgModal
        title="Activities Rules"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className={styles.rules} dangerouslySetInnerHTML={{ __html: voteRules || '' }}></div>
      </TgModal>
    </div>
  );
}
