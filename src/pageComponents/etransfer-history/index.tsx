import { History, ComponentStyle, CommonSpace } from '@etransfer/ui-react';
import '@etransfer/ui-react/dist/assets/index.css';
import { useResponsive } from 'hooks/useResponsive';
import { message } from 'antd';
import { useETransferAuthToken } from 'hooks/useETransferAuthToken';
import { useCallback, useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter } from 'next/navigation';
import { useTimeoutFn } from 'react-use';
import styles from './styles.module.css';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import useTelegram from 'hooks/useTelegram';

export default function ETransferHistory() {
  const { isMD, isLG } = useResponsive();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const { isInTG } = useTelegram();

  const { getETransferAuthToken } = useETransferAuthToken();

  const getAuthToken = useCallback(async () => {
    try {
      await getETransferAuthToken();
    } catch (error) {
      message.error(error as string);
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

  if (!isLogin) return null;

  return (
    <div className={clsx('m-auto', styles['etransfer-deposit-wrap'], isInTG && styles['etransfer-deposit-wrap-dark'])}>
      {isLG ? <BackCom className="mt-6 m-4 ml-4 lg:ml-10" theme={isInTG ? 'dark' : 'light'} /> : null}
      <CommonSpace direction={'vertical'} size={24} />
      <History componentStyle={isMD ? ComponentStyle.Mobile : ComponentStyle.Web} isUnreadHistory={false} />
    </div>
  );
}
