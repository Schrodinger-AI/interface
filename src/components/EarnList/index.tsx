import { formatTokenPrice } from 'utils/format';
import { EarnAmountCount } from './components/EarnAmountCount';
import BigNumber from 'bignumber.js';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useGetSignature } from 'hooks/useGetSignature';
import { bindAddress as bindEvmAddress } from 'api/request';
import { useWalletService } from 'hooks/useWallet';
import { ReactComponent as Question } from 'assets/img/icons/question.svg';
import { Button, HashAddress, ToolTip } from 'aelf-design';
import { useResponsive } from 'hooks/useResponsive';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useCmsInfo } from 'redux/hooks';
import { ReactComponent as WalletIcon } from 'assets/img/icons/wallet.svg';
import { ReactComponent as LinkIcon } from 'assets/img/icons/link-white.svg';
import clsx from 'clsx';

interface ITokenEarnListProps {
  dataSource: Array<IPointItem>;
  hasBoundAddress?: boolean;
  bindAddress?: () => void;
}

function PointItem({
  data,
  hasBoundAddress = false,
  bindAddress,
}: {
  data: IPointItem;
  hasBoundAddress?: boolean;
  bindAddress?: () => void;
}) {
  const { symbol, amount } = data;
  const { getSignInfo } = useGetSignature();
  const { wallet } = useWalletService();
  const [connected, setConnected] = useState<boolean>(false);
  const [evmAddress, setEvmAddress] = useState<string>('');
  const [bindLoading, setBindLoading] = useState<boolean>(false);
  const cmsInfo = useCmsInfo();

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  const account = useAccount();

  useEffect(() => {
    console.log('=====useAccountEffect', account);
    setConnected(account.isConnected);
    setEvmAddress(account.address || '');
  }, [account]);

  const sign = useCallback(async () => {
    try {
      if (bindLoading) return;
      setBindLoading(true);
      console.log('=====account sign');
      const info = `${wallet.address}-${evmAddress}`;
      const res = await getSignInfo(info);
      if (res?.publicKey && res.signature && evmAddress) {
        console.log('=====account SignInfo', res, evmAddress, wallet.address);

        await bindEvmAddress({
          aelfAddress: wallet.address,
          evmAddress,
          signature: res.signature,
          publicKey: res.publicKey,
        });
        bindAddress && bindAddress();
      }
    } catch (error) {
      /* empty */
      console.log('=====account error', error);
    }
    setBindLoading(false);
  }, [bindAddress, bindLoading, evmAddress, getSignInfo, wallet.address]);

  if (cmsInfo?.needBindEvm && cmsInfo.needBindEvm.includes(symbol)) {
    if (!hasBoundAddress) {
      return (
        <div>
          {connected ? (
            <div className="flex flex-col items-center">
              <div onClick={openAccountModal} className="mb-[16px]">
                <HashAddress
                  address={evmAddress}
                  preLen={8}
                  endLen={8}
                  hasCopy={false}
                  ignorePrefixSuffix={true}
                  size="large"
                />
              </div>

              <Button
                onClick={sign}
                type="primary"
                size="medium"
                className="!rounded-lg"
                loading={bindLoading}
                icon={<LinkIcon className="fill-white" />}>
                Bind address
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <Button
                onClick={openConnectModal}
                type="primary"
                size="medium"
                className="!rounded-lg w-full lg:w-auto"
                icon={<WalletIcon />}>
                Connect EVM wallet
              </Button>
            </div>
          )}
        </div>
      );
    }
  }
  return (
    <span>
      {amount
        ? `${formatTokenPrice(
            BigNumber(amount)
              .dividedBy(10 ** 8)
              .toNumber(),
          )} ${symbol}`
        : '--'}
    </span>
  );
}

function PointListItem({
  data,
  hasBoundAddress = false,
  bindAddress,
}: {
  data: IPointItem;
  hasBoundAddress?: boolean;
  bindAddress?: () => void;
}) {
  const { displayName, symbol, action, amount, ...props } = data;
  const cmsInfo = useCmsInfo();
  const { isLG } = useResponsive();

  return (
    <div
      className={clsx(
        'flex justify-between py-4 md:py-7 gap-x-8 text-[16px] leading-[24px] font-normal border-0 border-b border-solid border-[#EDEDED]',
        'flex-col items-start lg:flex-row',
      )}>
      <div className="flex items-center flex-1 break-all mb-[12px] lg:mb-0">
        <span className="text-[#919191] mr-[12px]">{displayName}</span>
        {cmsInfo?.needBindEvm && cmsInfo.needBindEvm.includes(symbol) ? (
          <ToolTip
            title={
              <div>
                <p>
                  1. Receive point rewards by contributing LP to the SGR/USDT trading pair on Uniswap V3, with a fee
                  rate of 1%. Provide the EVM address of the LP and start accumulating daily rewards.
                </p>
                <p>2. An aelf address can only be bound to one EVM address, and vice versa.</p>
                <p>
                  3. Do note that after an address is bound, it cannot be changed. Therefore, please confirm that the
                  EVM address is correct.
                </p>
              </div>
            }
            trigger={isLG ? 'click' : 'hover'}>
            <Question />
          </ToolTip>
        ) : null}
      </div>
      <span className="font-medium text-[#434343]">
        {action === 'SelfIncrease' ? (
          <>
            <EarnAmountCount {...props} amount={amount} />
            {` ${symbol}`}
          </>
        ) : (
          <PointItem data={data} hasBoundAddress={hasBoundAddress} bindAddress={bindAddress} />
        )}
      </span>
    </div>
  );
}

export function TokenEarnList({ dataSource, hasBoundAddress = false, bindAddress }: ITokenEarnListProps) {
  if (!dataSource?.length) return null;
  return (
    <div>
      {dataSource.map((pointDetail) => (
        <PointListItem
          key={pointDetail.action}
          data={pointDetail}
          hasBoundAddress={hasBoundAddress}
          bindAddress={bindAddress}></PointListItem>
      ))}
    </div>
  );
}
