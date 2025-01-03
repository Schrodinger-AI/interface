import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useGetSignature } from 'hooks/useGetSignature';
import { bindAddress as bindEvmAddress } from 'api/request';
import { Button, HashAddress, ToolTip } from 'aelf-design';
import { useResponsive } from 'hooks/useResponsive';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useCmsInfo } from 'redux/hooks';
import { ReactComponent as ArrowIcon } from 'assets/img/icons/arrow.svg';
import React from 'react';
import { openExternalLink } from 'utils/openlink';
import { OmittedType, getOmittedStr } from 'utils/addressFormatting';
import CommonCopy from 'components/CommonCopy';
import { TCustomizationItemType, TGlobalConfigType } from 'redux/types/reducerTypes';
import useTelegram from 'hooks/useTelegram';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export const jumpToEcoEarn = (params?: {
  isInTG?: boolean;
  cmsInfo?: (TCustomizationItemType & TGlobalConfigType) | undefined;
}) => {
  const { cmsInfo, isInTG = false } = params || {};
  const link = (isInTG ? cmsInfo?.ecoEarnTg : cmsInfo?.ecoEarn) || cmsInfo?.gitbookEcoEarn;
  if (!link) return;
  openExternalLink(link, '_blank');
};

function ActionComponent({
  data,
  hasBoundAddress = false,
  bindAddress,
  boundEvmAddress,
}: {
  data: IPointItem;
  hasBoundAddress?: boolean;
  bindAddress?: () => void;
  boundEvmAddress?: string;
}) {
  const { symbol } = data;
  const { getSignInfo } = useGetSignature();
  const { walletInfo } = useConnectWallet();
  const [connected, setConnected] = useState<boolean>(false);
  const [evmAddress, setEvmAddress] = useState<string>('');
  const [bindLoading, setBindLoading] = useState<boolean>(false);
  const cmsInfo = useCmsInfo();
  const { isLG } = useResponsive();
  const { isInTG } = useTelegram();

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  const account = useAccount();

  useEffect(() => {
    setConnected(account.isConnected);
    setEvmAddress(account.address || '');
  }, [account]);

  const sign = useCallback(async () => {
    try {
      if (bindLoading || !walletInfo?.address) return;
      setBindLoading(true);
      const info = `${walletInfo.address}-${evmAddress}`;
      const res = await getSignInfo(info);
      if (res?.publicKey && res.signature && evmAddress) {
        await bindEvmAddress({
          aelfAddress: walletInfo.address,
          evmAddress,
          signature: res.signature,
          publicKey: res.publicKey,
        });
        bindAddress && bindAddress();
      }
    } catch (error) {
      console.log('=====account error', error);
    }
    setBindLoading(false);
  }, [bindAddress, bindLoading, evmAddress, getSignInfo, walletInfo?.address]);

  if (cmsInfo?.needBindEvm && cmsInfo.needBindEvm.includes(symbol) && !hasBoundAddress) {
    return (
      <div className="w-full lg:w-auto">
        {connected ? (
          <div className="flex flex-col items-start w-full">
            <div onClick={openAccountModal} className="mb-[16px]">
              <HashAddress
                address={evmAddress}
                preLen={4}
                endLen={4}
                hasCopy={false}
                ignorePrefixSuffix={true}
                size="small"
              />
            </div>
            <Button
              type="link"
              loading={bindLoading}
              className="!h-[20px] !w-max !min-w-max !text-xs !font-medium !text-brandDefault !flex !items-center !p-0"
              onClick={sign}>
              Bind address
            </Button>
          </div>
        ) : (
          <div className="flex items-center w-full">
            <span
              className="text-xs font-medium text-brandDefault flex items-center cursor-pointer"
              onClick={openConnectModal}>
              Connect EVM wallet
            </span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start">
      {cmsInfo?.needBindEvm && cmsInfo.needBindEvm.includes(symbol) && boundEvmAddress ? (
        <CommonCopy toCopy={boundEvmAddress}>
          <ToolTip title={isLG ? '' : boundEvmAddress} trigger="hover">
            <span className="text-xs font-medium text-brandDefault">
              {getOmittedStr(boundEvmAddress, OmittedType.CUSTOM, {
                prevLen: 4,
                endLen: 4,
                limitLen: 9,
              })}
            </span>
          </ToolTip>
        </CommonCopy>
      ) : null}
      <div
        className="w-max flex items-center cursor-pointer"
        onClick={() =>
          jumpToEcoEarn({
            cmsInfo,
            isInTG,
          })
        }>
        <span className="text-xs font-medium text-brandDefault">Details</span>
        <ArrowIcon className="fill-brandDefault scale-75 ml-[8px]" />
      </div>
    </div>
  );
}

export default React.memo(ActionComponent);
