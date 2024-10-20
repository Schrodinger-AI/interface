/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useResponsive } from 'hooks/useResponsive';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from 'aelf-design';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useGetSignature } from 'hooks/useGetSignature';
import { ReactComponent as LinkIcon } from 'assets/img/icons/link.svg';
import { addressRelation, bindAddressActivity } from 'api/request';
import { useSearchParams } from 'next/navigation';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import clsx from 'clsx';
import { OmittedType, getOmittedStr } from 'utils/addressFormatting';
import CommonCopy from 'components/CommonCopy';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

function BindEvm() {
  const { isLG } = useResponsive();
  const { checkLogin } = useCheckLoginAndToken();
  const [connected, setConnected] = useState<boolean>(false);
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const [evmAddress, setEvmAddress] = useState<string>('');
  const [sourceChainAddress, setSourceChainAddress] = useState<string>('');
  const [bindLoading, setBindLoading] = useState<boolean>(false);
  const [hasBind, setHasBind] = useState<boolean>(false);
  const { walletInfo } = useConnectWallet();
  const { isLogin } = useGetLoginStatus();
  const { getSignInfo } = useGetSignature();
  const searchParams = useSearchParams();
  const { disconnect } = useDisconnect();

  const account = useAccount();

  const activityId = useMemo(() => searchParams.get('activityId'), [searchParams]);

  const getAddressRelation = async (address: string, activityId: string) => {
    try {
      const { sourceChainAddress } = await addressRelation({
        aelfAddress: address,
        activityId: activityId,
      });
      if (sourceChainAddress) {
        setSourceChainAddress(sourceChainAddress);
        setEvmAddress(sourceChainAddress);
        setHasBind(true);
        return true;
      } else {
        setHasBind(false);
        return false;
      }
    } catch (error) {
      setHasBind(false);
      return false;
    }
  };

  const sign = useCallback(async () => {
    try {
      if (bindLoading) return;
      setBindLoading(true);
      const info = `${walletInfo?.address}-${evmAddress}-${activityId}`;
      const res = await getSignInfo(info);
      if (res?.publicKey && res.signature && evmAddress && activityId && walletInfo?.address) {
        console.log('=====account SignInfo', res, evmAddress, walletInfo.address, activityId);
        await bindAddressActivity({
          aelfAddress: walletInfo.address,
          sourceChainAddress: evmAddress,
          signature: res.signature,
          publicKey: res.publicKey,
          activityId,
        });
        setSourceChainAddress(evmAddress);
        setEvmAddress(evmAddress);
        setHasBind(true);
        // getAddressRelation(walletInfo.address, activityId);
      }
    } catch (error) {
      /* empty */
      console.log('=====error', error);
    }
    setBindLoading(false);
  }, [activityId, bindLoading, evmAddress, getSignInfo, walletInfo?.address]);

  const toConnect = useCallback(() => {
    if (isLogin) {
      openConnectModal && openConnectModal();
    } else {
      checkLogin({
        onSuccess: async (address?: string) => {
          if (!address || !activityId) return;
          const bind = await getAddressRelation(address, activityId);
          if (bind) return;
          openConnectModal && openConnectModal();
        },
      });
    }
  }, [activityId, checkLogin, isLogin, openConnectModal]);

  const toBind = useCallback(() => {
    if (isLogin) {
      sign();
    } else {
      checkLogin();
    }
  }, [checkLogin, isLogin, sign]);

  const renderButton = useCallback(() => {
    if (hasBind) {
      return (
        <Button disabled={true} size={isLG ? 'small' : 'medium'} className="!rounded-lg w-[72px] lg:w-[90px]">
          binded
        </Button>
      );
    } else {
      if (connected && isLogin) {
        return (
          <Button
            type="primary"
            size={isLG ? 'small' : 'medium'}
            className="!rounded-lg w-[72px] lg:w-[90px]"
            onClick={toBind}
            loading={bindLoading}>
            Bind
          </Button>
        );
      } else {
        return (
          <Button
            type="primary"
            size={isLG ? 'small' : 'medium'}
            className="!rounded-lg w-[72px] lg:w-[90px]"
            onClick={toConnect}>
            Go
          </Button>
        );
      }
    }
  }, [bindLoading, connected, hasBind, isLG, isLogin, toBind, toConnect]);

  const renderAddress = useCallback(
    (address: string) => {
      return (
        <span className={clsx('text-sm font-medium', hasBind ? 'text-neutralDisable' : 'text-brandDefault')}>
          {isLG
            ? getOmittedStr(address, OmittedType.CUSTOM, {
                prevLen: 4,
                endLen: 4,
                limitLen: 9,
              })
            : getOmittedStr(address, OmittedType.ADDRESS)}
        </span>
      );
    },
    [hasBind, isLG],
  );

  useEffect(() => {
    setConnected(account.isConnected);
    setEvmAddress(account.address || '');
  }, [account]);

  useEffect(() => {
    if (walletInfo?.address && activityId) {
      getAddressRelation(walletInfo.address, activityId);
    } else {
      disconnect();
      setHasBind(false);
    }
  }, [walletInfo?.address, activityId, disconnect]);

  return (
    <div className="w-full h-full flex items-center justify-between">
      <div className="flex items-start flex-1">
        <div className="w-[48px] h-[48px] rounded-md bg-brandBg flex items-center justify-center mr-[12px]">
          <LinkIcon className="fill-brandDefault scale-[2.3]" />
        </div>
        <div className="flex flex-col min-h-[48px] justify-center flex-1">
          <span className="text-base text-neutralPrimary font-medium">
            {hasBind ? 'Address has been binded' : 'Bind the address'}
          </span>
          {isLogin && (evmAddress || sourceChainAddress) ? (
            <div
              onClick={hasBind ? undefined : openAccountModal}
              className={clsx(
                'mt-[4px] flex items-center w-max',
                hasBind ? '!text-neutralDisable' : '!text-brandDefault',
              )}>
              {hasBind ? (
                <CommonCopy toCopy={sourceChainAddress}>{renderAddress(sourceChainAddress)}</CommonCopy>
              ) : (
                renderAddress(evmAddress)
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="ml-[12px]">{renderButton()}</div>
    </div>
  );
}

export default React.memo(BindEvm);
