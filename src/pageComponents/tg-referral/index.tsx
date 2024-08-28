/* eslint-disable @next/next/no-img-element */
import { GetJoinRecord } from 'contract/schrodinger';
import { useWalletService } from 'hooks/useWallet';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useLoading from 'hooks/useLoading';
import { useCopyToClipboard } from 'react-use';
import { message } from 'antd';
import { QRCode } from 'react-qrcode-logo';
import { Button } from 'aelf-design';
import { PrimaryDomainName, TgPrimaryDomainName } from 'constants/common';
import clsx from 'clsx';
import { useCmsInfo, useJoinStatus } from 'redux/hooks';
import { appEnvironmentShare } from 'utils/appEnvironmentShare';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import styles from './style.module.css';
import { ReactComponent as InviteFriends } from 'assets/img/telegram/referral/invite-friends.svg';
import { ReactComponent as ReferralIcon } from 'assets/img/telegram/referral/icon-referral.svg';
import Link from 'next/link';

function TgReferral() {
  const { wallet } = useWalletService();

  const [, setCopied] = useCopyToClipboard();
  const isJoin = useJoinStatus();
  const cmsInfo = useCmsInfo();

  const { showLoading, closeLoading, visible } = useLoading();

  const router = useRouter();

  const checkJoined = useCallback(async () => {
    let isJoin = false;
    try {
      isJoin = await GetJoinRecord(wallet.address);
    } catch (error) {
      console.log('Referral-Record-error', error);
    } finally {
      closeLoading();
    }

    !isJoin && router.replace('/');
  }, [closeLoading, router, wallet.address]);

  const shareLink = useMemo(
    () => `https://t.me/share/url?url=${TgPrimaryDomainName}/?startapp=${wallet.address}`,
    [wallet.address],
  );

  const onCopy = useCallback(() => {
    setCopied(shareLink);
    message.success('Copied');
  }, [setCopied, shareLink]);

  // const onInvite = useCallback(() => {
  //   try {
  //     // appEnvironmentShare({
  //     //   shareContent: shareLink,
  //     // });
  //     shareLink
  //   } catch (error) {
  //     onCopy();
  //   }
  // }, [onCopy, shareLink]);

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
    <div className={clsx(styles['referral-container'])}>
      <div className="w-full p-[16px]">
        <BackCom theme="dark" />
      </div>

      <div className="w-full flex justify-between items-center px-[16px]">
        <InviteFriends className="flex-1" />
        <ReferralIcon className="max-w-[100px] h-auto" />
      </div>

      {cmsInfo?.referralRulesList?.length ? (
        <div className="w-full px-[16px] mt-[32px]">
          <div className="w-full bg-pixelsModalBg rounded-[16px] p-[12px]">
            {cmsInfo.referralRulesList.map((item, index) => {
              return (
                <p key={index} className="flex text-xs text-pixelsTertiaryTextPurple font-medium">
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
          <p className="w-full text-sm font-semibold text-pixelsWhiteBg text-center">
            Referral QR Code & Referral Link
          </p>
          <div className="w-full flex justify-center items-center mt-[16px]">
            <div className="rounded-md overflow-hidden">
              <QRCode
                value={shareLink}
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
              {shareLink}
            </span>
            <div className="h-full flex items-center justify-center pr-[16px] pl-[4px] cursor-pointer" onClick={onCopy}>
              <img src={require('assets/img/copy.svg').default} alt="copy" className="w-[16px] h-[16px]" />
            </div>
          </div>
          <Link
            href={shareLink}
            className="mt-[16px] h-[48px] flex justify-center items-center w-full !rounded-lg bg-pixelsWhiteBg text-pixelsPageBg font-semibold">
            Invite Friends
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TgReferral;
