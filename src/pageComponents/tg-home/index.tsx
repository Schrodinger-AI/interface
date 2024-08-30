'use client';

import { getCatDetail } from 'api/request';
import clsx from 'clsx';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useWalletService } from 'hooks/useWallet';
import { useCallback, useEffect, useState } from 'react';
import { useCmsInfo, useJoinStatus } from 'redux/hooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { TSGRTokenInfo } from 'types/tokens';
import styles from './style.module.css';
import BalanceModule from './components/BalanceModule';
import AdoptModule from './components/AdoptModule';
import { DIRECT_ADOPT_GEN9_MIN, GEN0_SYMBOL } from 'constants/common';
import { divDecimals } from 'utils/calculate';
import { useModal } from '@ebay/nice-modal-react';
import TipsModal from 'components/TipsModal';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { BUY_SGR_URL } from 'constants/router';
import { AdTracker } from 'utils/ad';
import moment from 'moment';
import FooterButtons from './components/FooterButtons';
import FloatingButton from './components/FloatingButton';
import { TelegramPlatform } from '@portkey/did-ui-react';
import ScrollAlert, { IScrollAlertItem } from 'components/ScrollAlert';
import useGetNoticeData from 'pageComponents/tokensPage/hooks/useGetNoticeData';
import { AcceptReferral } from 'contract/schrodinger';
import { store } from 'redux/store';
import { setIsJoin } from 'redux/reducer/info';

export default function TgHome() {
  const adoptHandler = useAdoptHandler();
  const { wallet } = useWalletService();
  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const { isLogin } = useGetLoginStatus();
  const cmsInfo = useCmsInfo();
  const { jumpToPage } = useJumpToPage();
  const tipsModal = useModal(TipsModal);
  const [sgrBalance, setSgrBalance] = useState('0');
  const [noticeData, setNoticeData] = useState<IScrollAlertItem[]>([]);
  const { getNoticeData } = useGetNoticeData();
  const isJoin = useJoinStatus();

  const onBalanceChange = useCallback((value: string) => {
    value && setSgrBalance(value);
  }, []);

  const getDetail = useCallback(async () => {
    if (wallet.address && !isLogin) return;
    try {
      const result = await getCatDetail({
        symbol: GEN0_SYMBOL,
        chainId: cmsInfo?.curChain || '',
        address: wallet.address,
      });
      setSchrodingerDetail(result);
    } catch (error) {
      /* empty */
    }
  }, [cmsInfo?.curChain, isLogin, wallet.address]);

  const getNotice = useCallback(async () => {
    try {
      const res = await getNoticeData({
        theme: 'dark',
      });
      setNoticeData(res);
    } catch (error) {
      setNoticeData([]);
    }
  }, [getNoticeData]);

  const OpenAdoptModal = useCallback(() => {
    if (!wallet.address || !schrodingerDetail) return;
    if (divDecimals(sgrBalance, 8).lt(DIRECT_ADOPT_GEN9_MIN)) {
      tipsModal.show({
        innerText: `Insufficient funds, deposit a minimum of ${DIRECT_ADOPT_GEN9_MIN}$SGR to adopt a cat.`,
        btnText: 'Buy $SGR',
        onConfirm: () => {
          jumpToPage({ link: BUY_SGR_URL, linkType: 'link' });
          tipsModal.hide();
        },
        theme: 'dark',
      });
      return;
    }
    adoptHandler({
      parentItemInfo: schrodingerDetail,
      account: wallet.address,
      isDirect: true,
      theme: 'dark',
      prePage: 'adoptModal',
    });
  }, [adoptHandler, jumpToPage, schrodingerDetail, sgrBalance, tipsModal, wallet.address]);

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
    if (!wallet.address) return;
    sendAdTrack(wallet?.address);
  }, [wallet?.address]);

  useEffect(() => {
    if (isLogin && !isJoin) {
      const referrerAddress = TelegramPlatform.getInitData()?.start_param;
      if (referrerAddress) {
        acceptReferral(referrerAddress);
      }
    }
  }, [isLogin, isJoin]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useEffect(() => {
    getNotice();
  }, [getNotice]);

  return (
    <div
      className={clsx('flex flex-col max-w-[2560px] w-full min-h-screen px-4 py-6 pb-[112px]', styles.pageContainer)}>
      {noticeData && noticeData?.length ? (
        <div className="w-full h-[48px] overflow-hidden mb-[8px] rounded-md">
          <ScrollAlert data={noticeData} type="notice" theme="dark" />
        </div>
      ) : null}
      <BalanceModule onSgrBalanceChange={onBalanceChange} />
      <div className="mt-10">
        <AdoptModule onAdopt={OpenAdoptModal} />
      </div>

      <FooterButtons cId={schrodingerDetail?.collectionId || ''} />
      <FloatingButton />
    </div>
  );
}
