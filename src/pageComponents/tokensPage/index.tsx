'use client';
import TokensInfo from 'components/TokensInfo';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import { useCallback, useEffect, useState } from 'react';
import { IScrollAlertItem } from 'components/ScrollAlert';
import useGetNoticeData from './hooks/useGetNoticeData';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function TokensPage() {
  const { getNoticeData } = useGetNoticeData();

  const [noticeData, setNoticeData] = useState<IScrollAlertItem[]>([]);

  const getNotice = useCallback(async () => {
    try {
      const res = await getNoticeData();
      setNoticeData(res);
    } catch (error) {
      setNoticeData([]);
    }
  }, [getNoticeData]);

  useEffect(() => {
    getNotice();
  }, [getNotice]);

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

          console.log('=====account', account);

          return (
            <div>
              {(() => {
                if (!connected) {
                  return (
                    <button onClick={openConnectModal} type="button">
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button">
                      Wrong network
                    </button>
                  );
                }

                return <div>Connect</div>;
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
      {/* <ConnectButton /> */}
      <TokensInfo />
      <OwnedItems noticeData={noticeData} pageState={ListTypeEnum.All} />
    </div>
  );
}
