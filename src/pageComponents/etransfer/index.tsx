import { Deposit, ETransferDepositProvider, ComponentStyle, ETransferConfig } from '@etransfer/ui-react';
import '@etransfer/ui-react/dist/assets/index.css';
import { useResponsive } from 'hooks/useResponsive';
import { Breadcrumb, message } from 'antd';
import { useETransferAuthToken } from 'hooks/useETransferAuthToken';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';
import { useTimeoutFn } from 'react-use';
import styles from './styles.module.css';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import useTelegram from 'hooks/useTelegram';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ReactComponent as HistoryFilled } from 'assets/img/icons/history-filled.svg';
import { ReactComponent as HistoryOutlined } from 'assets/img/icons/history-outlined.svg';

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

  const [loading, setLoading] = useState(false);
  const { getETransferAuthToken } = useETransferAuthToken();

  const getAuthToken = useCallback(async () => {
    try {
      setLoading(true);
      await getETransferAuthToken();
    } catch (error) {
      message.error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getETransferAuthToken]);

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

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  if (loading || !isLogin) return null;

  return (
    <div
      className={clsx(
        'm-auto max-w-[1024px] relative',
        styles['etransfer-deposit-wrap'],
        isInTG && styles['etransfer-deposit-wrap-dark'],
      )}>
      {isLG ? null : (
        <Link
          href={'/etransfer-history'}
          className="absolute top-[46px] right-[32px] h-[40px] rounded-lg bg-brandBg px-[16px] flex justify-center items-center">
          <HistoryFilled className="mr-[8px]" />
          <span className="text-base font-medium text-brandDefault">history</span>
        </Link>
      )}

      {isInTG && <DarkModal />}
      {isLG ? (
        <div className="mb-[16px]">
          <BackCom className="mt-6 m-4 ml-0 lg:ml-10" theme={isInTG ? 'dark' : 'light'} />
          <div className="w-full flex justify-between items-center">
            <span className={clsx('text-lg font-semibold', isInTG ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              Deposit Assets
            </span>
            <Link href={'/etransfer-history'} className="pl-[16px]">
              <HistoryOutlined className={clsx(isInTG ? 'fill-pixelsTertiaryTextPurple' : 'fill-brandDefault')} />
            </Link>
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
                title: <div>Deposit Assets</div>,
              },
            ]}
          />
        </div>
      )}
      <ETransferDepositProvider>
        <Deposit componentStyle={isMD ? ComponentStyle.Mobile : ComponentStyle.Web} />
      </ETransferDepositProvider>
    </div>
  );
}
