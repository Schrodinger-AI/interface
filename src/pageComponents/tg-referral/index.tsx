/* eslint-disable @next/next/no-img-element */
import { GetJoinRecord, Join } from 'contract/schrodinger';
import { useWalletService } from 'hooks/useWallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useLoading from 'hooks/useLoading';
import { useCopyToClipboard } from 'react-use';
import { Button, Flex, message } from 'antd';
import { QRCode } from 'react-qrcode-logo';
import clsx from 'clsx';
import { useCmsInfo, useJoinStatus } from 'redux/hooks';
import styles from './style.module.css';
import { ReactComponent as CopyIcon } from 'assets/img/copy.svg';
import FooterButtons from 'pageComponents/tg-home/components/FooterButtons';
import { store } from 'redux/store';
import { setIsJoin } from 'redux/reducer/info';
import { getDomain } from 'utils';

function TgReferral() {
  const { wallet } = useWalletService();

  const [, setCopied] = useCopyToClipboard();
  const isJoin = useJoinStatus();
  const cmsInfo = useCmsInfo();
  const [loading, setLoading] = useState<boolean>(false);

  const { showLoading, closeLoading, visible } = useLoading();

  const toJoin = async () => {
    try {
      setLoading(true);
      const domain = getDomain();
      await Join({
        domain,
      });
      store.dispatch(setIsJoin(true));
    } finally {
      setLoading(false);
    }
  };

  const checkJoined = useCallback(async () => {
    let isJoin = false;
    try {
      isJoin = await GetJoinRecord(wallet.address);
    } finally {
      closeLoading();
    }

    !isJoin && store.dispatch(setIsJoin(isJoin));
  }, [closeLoading, wallet.address]);

  const copyLink = useMemo(
    () => `${cmsInfo?.tgWebAppUrl}/?startapp=${wallet.address}`,
    [cmsInfo?.tgWebAppUrl, wallet.address],
  );

  const shareLink = useMemo(
    () => `https://t.me/share/url?url=${cmsInfo?.tgWebAppUrl}/?startapp=${wallet.address}`,
    [cmsInfo?.tgWebAppUrl, wallet.address],
  );

  const handleJoin = async () => {
    await toJoin();
    checkJoined();
  };

  const onCopy = useCallback(() => {
    setCopied(copyLink);
    message.success('Copied');
  }, [setCopied, copyLink]);

  const onInvite = useCallback(() => {
    try {
      if (window?.Telegram?.WebApp?.openTelegramLink) {
        window?.Telegram?.WebApp?.openTelegramLink(shareLink);
      }
    } catch (error) {
      onCopy();
    }
  }, [onCopy, shareLink]);

  useEffect(() => {
    showLoading();
    if (wallet.address && !isJoin) {
      checkJoined();
    } else {
      closeLoading();
    }
  }, [checkJoined, wallet.address, isJoin, showLoading, closeLoading]);

  if (visible) return null;

  return (
    <>
      {!isJoin ? (
        <Flex vertical justify="center" align="center" className="w-full h-full" gap={24}>
          <p className="text-[14px] leading-[24px] text-white font-medium text-center">
            Join the project and draw rare cats <br /> with your friends
          </p>
          <Button
            loading={loading}
            className="w-[164px] h-[48px] !rounded-[12px] !text-black !bg-white font-bold text-[24px]"
            onClick={handleJoin}>
            Join
          </Button>
        </Flex>
      ) : (
        <div className={clsx(styles['referral-container'])}>
          <div className="pb-[100px]">
            <div className="w-full flex justify-between items-center px-[16px]">
              <img
                src={require('assets/img/telegram/friend-header.png').default.src}
                alt=""
                className="w-[100vw] h-auto"
              />
            </div>

            {cmsInfo?.referralRulesList?.length ? (
              <div className="w-full px-[16px] mt-[32px]">
                <div className="w-full bg-pixelsModalBg rounded-[16px] p-[12px]">
                  {cmsInfo.referralRulesList.map((item, index) => {
                    return (
                      <p key={index} className="flex text-sm text-pixelsWhiteBg font-medium">
                        <span className="mr-[8px]">•</span>
                        <span>{item}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="w-full px-[16px] mt-[32px]">
              <div className="w-full rounded-[16px] p-[16px] bg-pixelsPrimaryTextPurple">
                <p className="w-full text-sm font-semibold text-pixelsWhiteBg text-center">QR Code & Invite Link</p>
                <div className="w-full flex justify-center items-center mt-[16px]">
                  <div className="rounded-md overflow-hidden">
                    <QRCode
                      value={copyLink}
                      size={160}
                      quietZone={8}
                      logoImage={require('assets/img/schrodingerLogo.png').default.src}
                      fgColor="#1A1A1A"
                      logoWidth={30}
                      logoHeight={30}
                    />
                  </div>
                </div>
                <div className="w-full mt-[16px] flex items-center rounded-lg bg-[#6724D4]">
                  <span className="flex-1 text-sm text-pixelsWhiteBg truncate py-[16px] pl-[16px] pr-[4px] font-medium">
                    {copyLink}
                  </span>
                  <div
                    className="h-full flex items-center justify-center pr-[16px] pl-[4px] cursor-pointer"
                    onClick={onCopy}>
                    <CopyIcon className="fill-pixelsWhiteBg scale-[1.142]" />
                  </div>
                </div>
                <div
                  onClick={onInvite}
                  className="mt-[16px] h-[48px] flex justify-center items-center w-full !rounded-lg bg-pixelsWhiteBg text-pixelsPageBg font-semibold cursor-pointer">
                  Invite Friends
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FooterButtons />
    </>
  );
}

export default TgReferral;
