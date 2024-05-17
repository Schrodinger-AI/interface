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
  const { isLG } = useResponsive();
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
      console.log('=====account sign');
      const info = `${wallet.address}-${evmAddress}`;
      const res = await getSignInfo(info);
      if (res?.publicKey && res.signature && evmAddress) {
        console.log('=====account SignInfo', res, evmAddress, wallet.address);
        setBindLoading(true);
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
  }, [bindAddress, evmAddress, getSignInfo, wallet.address]);

  if (cmsInfo?.needBindEvm && cmsInfo.needBindEvm.includes(symbol)) {
    if (!hasBoundAddress) {
      return (
        <div>
          {connected ? (
            <div className="flex items-center">
              <div onClick={openAccountModal}>
                <HashAddress address={evmAddress} preLen={8} endLen={8} hasCopy={false} ignorePrefixSuffix={true} />
              </div>

              <Button onClick={sign} type="primary" size="medium" className="ml-[12px]" loading={bindLoading}>
                bind
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <Button onClick={openConnectModal} type="primary" size="medium" className="mr-[12px]">
                connect
              </Button>
              <ToolTip
                title={
                  <div>
                    <p>
                      1. Link to SGR/USDT in Uniswap V3, the transaction rate is 1%. In the trading pair, the EVM
                      address of the LP is provided, and the daily rewards are settled based on the provided LP;
                    </p>
                    <p>
                      2. An Aelf address can only be bound to one EVM address, and an EVM can also only be bound to one
                      Aelf address;
                    </p>
                    <p>
                      3. After the address is bound, the bound address cannot be changed. Please confirm that the EVM
                      address is correct.
                    </p>
                  </div>
                }
                trigger={isLG ? 'click' : 'hover'}>
                <Question />
              </ToolTip>
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
  return (
    <div className="flex items-center justify-between py-4 md:py-7 gap-x-8 text-[16px] leading-[24px] font-normal border-0 border-b border-solid border-[#EDEDED]">
      <span className="flex-1 text-[#919191] break-all">{displayName}</span>
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
