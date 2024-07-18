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

export default function ETransfer() {
  const { isMD } = useResponsive();
  const cmsInfo = useCmsInfo();
  const searchParams = useSearchParams();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();

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
      router.replace('/');
    }
  }, 3000);

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
    <div className="m-auto max-w-[1024px]">
      <ETransferDepositProvider>
        <Deposit componentStyle={isMD ? ComponentStyle.Mobile : ComponentStyle.Web} />
      </ETransferDepositProvider>
    </div>
  );
}
