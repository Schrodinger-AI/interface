import { History, ComponentStyle } from '@etransfer/ui-react';
import '@etransfer/ui-react/dist/assets/index.css';
import { useResponsive } from 'hooks/useResponsive';
import { Breadcrumb, message } from 'antd';
import { useETransferAuthToken } from 'hooks/useETransferAuthToken';
import { useCallback, useEffect, useState } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter } from 'next/navigation';
import { useTimeoutFn } from 'react-use';
import styles from './styles.module.css';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import useTelegram from 'hooks/useTelegram';
import dynamic from 'next/dynamic';

const DarkModal = dynamic(
  async () => {
    const modal = await import('../etransfer/darkModal').then((module) => module);
    return modal;
  },
  { ssr: false },
) as any;

export default function ETransferHistory() {
  const { isMD, isLG } = useResponsive();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const { isInTG } = useTelegram();
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

  if (loading || !isLogin) return null;

  return (
    <div className={clsx('m-auto', styles['etransfer-history-wrap'], isInTG && styles['etransfer-history-wrap-dark'])}>
      {isLG ? (
        <BackCom className="mt-6 m-4 ml-0 mb-0" theme={isInTG ? 'dark' : 'light'} />
      ) : (
        <div className="px-[32px] mb-[24px]">
          <Breadcrumb
            items={[
              {
                title: (
                  <span className=" cursor-pointer" onClick={() => router.replace(isInTG ? '/telegram/home' : '/')}>
                    Schrodinger
                  </span>
                ),
              },
              {
                title: (
                  <span className=" cursor-pointer" onClick={() => router.back()}>
                    Deposit Assets
                  </span>
                ),
              },
              {
                title: <div>History</div>,
              },
            ]}
          />
        </div>
      )}
      {isInTG && <DarkModal />}
      <History componentStyle={isMD ? ComponentStyle.Mobile : ComponentStyle.Web} isUnreadHistory={false} />
    </div>
  );
}
