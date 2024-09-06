import '@etransfer/ui-react/dist/assets/index.css';
import { useResponsive } from 'hooks/useResponsive';
import { useEffect, useMemo, useState } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';
import { useTimeoutFn } from 'react-use';
import styles from './style.module.css';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import useTelegram from 'hooks/useTelegram';
import dynamic from 'next/dynamic';
import { ComponentType, Swap } from '@portkey/trader-react-ui';
import { AwakenSwapper, IPortkeySwapperAdapter } from '@portkey/trader-core';
import { getRpcUrls } from 'constants/url';
import { useWalletService } from 'hooks/useWallet';
import { WalletType } from 'aelf-web-login';
import useSwapService from './hooks/useSwapService';
import '@portkey/trader-react-ui/dist/assets/index.css';
import './style.css';

const DarkModal = dynamic(
  async () => {
    const modal = await import('./darkModal').then((module) => module);
    return modal;
  },
  { ssr: false },
) as any;

export default function AwakenSwap() {
  const { isMD, isLG } = useResponsive();
  const cmsInfo = useCmsInfo();
  const searchParams = useSearchParams();
  const { isLogin } = useGetLoginStatus();
  const { walletType } = useWalletService();
  const router = useRouter();
  const { isInTG } = useTelegram();
  const { getOptions, tokenApprove } = useSwapService();

  const [loading, setLoading] = useState(false);
  const [awakenInstance, setAwakenInstance] = useState<IPortkeySwapperAdapter>();

  const defaultParams = useMemo(() => {
    return {
      selectTokenInSymbol: searchParams.get('selectTokenInSymbol') || 'ELF',
      selectTokenOutSymbol: searchParams.get('selectTokenOutSymbol') || 'SGR-1',
    };
  }, [searchParams]);

  const awakenProps = useMemo(() => {
    if (!awakenInstance || (walletType === WalletType.portkey && !tokenApprove)) return undefined;
    return {
      instance: awakenInstance,
      tokenApprove: walletType === WalletType.portkey ? tokenApprove : undefined,
      getOptions,
    };
  }, [awakenInstance, getOptions, tokenApprove, walletType]);

  useTimeoutFn(() => {
    if (!isLogin) {
      if (!isInTG) {
        router.replace('/');
      }
    }
  }, 4000);

  useEffect(() => {
    setLoading(true);

    if (!cmsInfo) return;
    const awakenIns = new AwakenSwapper({
      contractConfig: {
        swapContractAddress: cmsInfo?.awakenSwapContractAddress || '',
        rpcUrl: getRpcUrls()[cmsInfo.curChain] || '',
      },
      requestDefaults: {
        baseURL: cmsInfo?.awakenUrl,
      },
    });
    awakenIns && setAwakenInstance(awakenIns);
    setLoading(false);
  }, [cmsInfo]);

  if (!awakenProps || loading || !isLogin) return null;

  return (
    <div
      className={clsx(
        'm-auto max-w-[668px] relative',
        isLG && styles['swap-wrap'],
        isInTG && styles['swap-wrap-dark'],
      )}>
      {isInTG && <DarkModal />}
      <BackCom className="mb-[24px]" theme={isInTG ? 'dark' : 'light'} />
      <div
        className={clsx(
          'w-full',
          isLG ? 'border-none rounded-none p-0' : 'border border-solid border-neutralBorder rounded-[20px] p-[24px]',
        )}>
        <p className={clsx('text-2xl font-semibold !mb-[24px]', isInTG ? 'dark-title' : 'text-neutralTitle')}>Swap</p>
        <Swap
          selectTokenInSymbol={defaultParams.selectTokenInSymbol}
          selectTokenOutSymbol={defaultParams.selectTokenOutSymbol}
          containerClassName={styles['awaken-wrap']}
          componentUiType={isMD ? ComponentType.Mobile : ComponentType.Web}
          onConfirmSwap={() => {
            console.log('=====onConfirmSwap');
          }}
          chainId={cmsInfo?.curChain}
          awaken={awakenProps}
        />
      </div>
    </div>
  );
}
