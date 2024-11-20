'use client';

import { getCatDetail } from 'api/request';
import clsx from 'clsx';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useCallback, useEffect, useState } from 'react';
import { useCmsInfo, useJoinStatus } from 'redux/hooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { TSGRTokenInfo } from 'types/tokens';
import styles from './style.module.css';
import BalanceModule from './components/BalanceModule';
import AdoptModule from './components/AdoptModule';
import { DIRECT_ADOPT_GEN9_MIN, GEN0_SYMBOL } from 'constants/common';
import { divDecimals } from 'utils/calculate';
import { AdTracker } from 'utils/ad';
import moment from 'moment';
import FooterButtons from './components/FooterButtons';
import FloatingButton from './components/FloatingButton';
import { AcceptReferral } from 'contract/schrodinger';
import { dispatch, store } from 'redux/store';
import { setCatDetailInfo, setIsJoin } from 'redux/reducer/info';
import { useBuyToken } from 'hooks/useBuyToken';
import PurchaseMethodModal from 'components/PurchaseMethodModal';
import { useModal } from '@ebay/nice-modal-react';
import { formatTokenPrice } from 'utils/format';
import useTelegram from 'hooks/useTelegram';
import useBalanceService from './hooks/useBalanceService';
import { useRouter } from 'next/navigation';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import useIsInActivity from 'pageComponents/tg-battle/hooks/useIsInActivity';
import { getTgStartParam } from 'utils/getTgStartParam';
import RewardsCard from './components/RewardsCard';
import SyncingOnChainLoading from 'components/SyncingOnChainLoading';

export default function TgHome() {
  const router = useRouter();
  const adoptHandler = useAdoptHandler();
  const { walletInfo } = useConnectWallet();
  const { isInTelegram } = useTelegram();
  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const { isLogin } = useGetLoginStatus();
  const cmsInfo = useCmsInfo();
  const isActivity = useIsInActivity();
  const [sgrBalance, setSgrBalance] = useState('0');
  const [elfBalance, setElfBalance] = useState('0');
  const syncingOnChainLoading = useModal(SyncingOnChainLoading);

  const isJoin = useJoinStatus();
  const { checkBalanceAndJump } = useBuyToken();

  const onBalanceChange = useCallback((value: string) => {
    value && setSgrBalance(value);
  }, []);
  const onElfBalanceChange = useCallback((value: string) => {
    value && setElfBalance(value);
  }, []);

  const { balanceData } = useBalanceService({
    onSgrBalanceChange: onBalanceChange,
    onElfBalanceChange,
  });
  const purchaseMethodModal = useModal(PurchaseMethodModal);

  const getDetail = useCallback(async () => {
    if (walletInfo?.address && !isLogin) return;
    try {
      const result = await getCatDetail({
        symbol: GEN0_SYMBOL,
        chainId: cmsInfo?.curChain || '',
        address: walletInfo?.address,
      });
      setSchrodingerDetail(result);
    } catch (error) {
      /* empty */
    }
  }, [cmsInfo?.curChain, isLogin, walletInfo?.address]);

  const OpenAdoptModal = useCallback(() => {
    if (!isLogin) {
      syncingOnChainLoading.show({ checkLogin: true });
      return;
    }
    if (isActivity) {
      dispatch(setCatDetailInfo(schrodingerDetail));
      router.push('/telegram/battle');
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
      account: walletInfo.address,
      isDirect: true,
      theme: 'dark',
      prePage: 'adoptModal',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    adoptHandler,
    checkBalanceAndJump,
    elfBalance,
    purchaseMethodModal,
    schrodingerDetail,
    sgrBalance,
    walletInfo?.address,
    isActivity,
  ]);

  const sendAdTrack = (address: string) => {
    const tg_user_click_daily: {
      address: string;
      time: string;
    } = JSON.parse(localStorage.getItem('tg_user_click_daily') || '{}');

    const curTime = moment().utc().format('YYYY/MM/DD');

    if (tg_user_click_daily.address !== address || tg_user_click_daily.time !== curTime) {
      localStorage.setItem(
        'tg_user_click_daily',
        JSON.stringify({
          address,
          time: curTime,
        }),
      );

      AdTracker.trackEvent('tg_user_click_daily', {
        address,
        user_id: address,
      });
    }
  };

  const acceptReferral = async (referrerAddress: string) => {
    try {
      await AcceptReferral({
        referrer: referrerAddress,
      });

      store.dispatch(setIsJoin(true));
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    if (!walletInfo?.address) return;
    sendAdTrack(walletInfo?.address);
  }, [walletInfo?.address]);

  useEffect(() => {
    if (isLogin && !isJoin) {
      const { start_param } = getTgStartParam();
      const referrerAddress = start_param.address;

      console.log('=====referrerAddress', referrerAddress);
      if (referrerAddress) {
        acceptReferral(referrerAddress);
      }
    }
  }, [isLogin, isJoin]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useEffect(() => {
    if (isInTelegram()) {
      window?.Telegram?.WebApp?.disableVerticalSwipes?.();
    }
  }, [isInTelegram]);

  return (
    <div
      style={{ backgroundImage: `url(${cmsInfo?.homeBg})` }}
      className={clsx(
        'flex flex-col max-w-[2560px] w-full min-h-screen px-4 pt-[16px] pb-[112px]',
        isActivity ? styles['pageContainer-activity'] : styles.pageContainer,
      )}>
      <BalanceModule balanceData={balanceData} />
      {/* {noticeData && noticeData?.length ? (
        <div className="relative z-20 w-full h-[32px] overflow-hidden my-[8px] rounded-md">
          <ScrollAlert data={noticeData} type="info" theme="dark" />
        </div>
      ) : null} */}
      <RewardsCard theme="dark" />
      <AdoptModule onAdopt={OpenAdoptModal} isInActivity={isActivity} cId={schrodingerDetail?.collectionId || ''} />
      <FooterButtons />
      <FloatingButton />
    </div>
  );
}
