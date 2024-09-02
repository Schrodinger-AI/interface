import '@etransfer/ui-react/dist/assets/index.css';
import { useResponsive } from 'hooks/useResponsive';
import { Breadcrumb } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

const DarkModal = dynamic(
  async () => {
    const modal = await import('pageComponents/etransfer/darkModal').then((module) => module);
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

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    setLoading(true);

    if (!cmsInfo) return;
    const awakenIns = new AwakenSwapper({
      contractConfig: {
        swapContractAddress: cmsInfo?.awakenSwapContractAddress,
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
        'm-auto max-w-[1024px] relative',
        styles['etransfer-deposit-wrap'],
        isInTG && styles['etransfer-deposit-wrap-dark'],
      )}>
      {isInTG && <DarkModal />}
      {isLG ? (
        <div className="mb-[16px]">
          <BackCom className="mt-6 m-4 ml-0 lg:ml-10" theme={isInTG ? 'dark' : 'light'} />
          <div className="w-full flex justify-between items-center">
            <span className={clsx('text-lg font-semibold', isInTG ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              Swap
            </span>
          </div>
        </div>
      ) : (
        <div className="px-[32px] mb-[24px]">
          <Breadcrumb
            items={[
              {
                title: (
                  <span className=" cursor-pointer" onClick={onBack}>
                    Schrodinger
                  </span>
                ),
              },
              {
                title: <div>Swap</div>,
              },
            ]}
          />
        </div>
      )}
      <Swap
        selectTokenInSymbol={defaultParams.selectTokenInSymbol}
        selectTokenOutSymbol={defaultParams.selectTokenOutSymbol}
        containerClassName={styles.awakenWrap}
        componentUiType={isMD ? ComponentType.Mobile : ComponentType.Web}
        onConfirmSwap={() => {
          console.log('=====onConfirmSwap');
        }}
        chainId={cmsInfo?.curChain}
        awaken={awakenProps}
      />
    </div>
  );
}
