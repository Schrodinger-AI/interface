import { Deposit, ETransferDepositProvider, ComponentStyle } from '@etransfer/ui-react';
import '@etransfer/ui-react/dist/assets/index.css';
import { useResponsive } from 'hooks/useResponsive';
import { message } from 'antd';
import { useETransferAuthToken } from 'hooks/useETransferAuthToken';
import useLoading from 'hooks/useLoading';
import { useCallback, useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

export default function ETransfer() {
  const { isMD } = useResponsive();

  const { isLogin } = useGetLoginStatus();

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
  }, [getAuthToken, isLogin]);

  if (visible || !isLogin) return null;

  return (
    <div className="m-auto max-w-[1024px]">
      <ETransferDepositProvider>
        <Deposit componentStyle={isMD ? ComponentStyle.Mobile : ComponentStyle.Web} />
      </ETransferDepositProvider>
    </div>
  );
}
