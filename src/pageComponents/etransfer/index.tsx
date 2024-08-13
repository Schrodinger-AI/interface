import { Deposit, ETransferDepositProvider, ComponentStyle, ETransferConfig } from '@etransfer/ui-react';
import '@etransfer/ui-react/dist/assets/index.css';
import { useResponsive } from 'hooks/useResponsive';
import { message } from 'antd';
import { useETransferAuthToken } from 'hooks/useETransferAuthToken';
import useLoading from 'hooks/useLoading';
import { useCallback, useEffect, useMemo } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';
import { useTimeoutFn } from 'react-use';
import styles from './styles.module.css';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import useTelegram from 'hooks/useTelegram';
import dynamic from 'next/dynamic';

const DarkModal = dynamic(
  async () => {
    const modal = await import('./darkModal').then((module) => module);
    return modal;
  },
  { ssr: false },
) as any;

export default function ETransfer() {
  const { isMD, isLG } = useResponsive();
  const cmsInfo = useCmsInfo();
  const searchParams = useSearchParams();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const { isInTG } = useTelegram();

  const defaultParams = useMemo(() => {
    return {
      tokenSymbol: searchParams.get('tokenSymbol'),
      depositToToken: searchParams.get('depositToToken'),
      depositFromNetwork: searchParams.get('depositFromNetwork'),
    };
  }, [searchParams]);

  const { showLoading, closeLoading, visible } = useLoading();
  const { getETransferAuthToken } = useETransferAuthToken();

  const getAuthToken = useCallback(async () => {
    try {
      showLoading();
      await getETransferAuthToken();
    } catch (error) {
      message.error(error as string);
    } finally {
      closeLoading();
    }
  }, [closeLoading, getETransferAuthToken, showLoading]);

  useEffect(() => {
    if (!isLogin) return;
    getAuthToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  useTimeoutFn(() => {
    if (!isLogin) {
      if (!isInTG) {
        router.replace('/');
      }
    }
  }, 4000);

  useEffect(() => {
    ETransferConfig.setConfig({
      depositConfig: {
        defaultDepositToken: defaultParams.tokenSymbol || 'USDT',
        defaultReceiveToken: defaultParams.depositToToken || 'SGR-1',
        defaultChainId: cmsInfo?.curChain || 'tDVV',
        defaultNetwork: defaultParams.depositFromNetwork || 'TRX',
      },
    });
  }, [cmsInfo?.curChain, defaultParams]);

  if (visible || !isLogin) return null;

  return (
    <div
      className={clsx(
        'm-auto max-w-[1024px]',
        styles['etransfer-deposit-wrap'],
        isInTG && styles['etransfer-deposit-wrap-dark'],
      )}>
      {isInTG && <DarkModal />}
      {isLG ? <BackCom className="mt-6 m-4 ml-4 lg:ml-10" theme={isInTG ? 'dark' : 'light'} /> : null}
      <ETransferDepositProvider>
        <Deposit componentStyle={isMD ? ComponentStyle.Mobile : ComponentStyle.Web} />
      </ETransferDepositProvider>
    </div>
  );
}
