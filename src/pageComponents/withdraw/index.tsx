import { Withdraw, ETransferWithdrawProvider, ComponentStyle, ETransferConfig } from '@etransfer/ui-react';
import '@etransfer/ui-react/dist/assets/index.css';
import { useResponsive } from 'hooks/useResponsive';
import { Breadcrumb, message } from 'antd';
import { useETransferAuthToken } from 'hooks/useETransferAuthToken';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';
import styles from './styles.module.css';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import useTelegram from 'hooks/useTelegram';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ReactComponent as HistoryFilled } from 'assets/img/icons/history-filled.svg';
import { ReactComponent as HistoryOutlined } from 'assets/img/icons/history-outlined.svg';
import { Button } from 'aelf-design';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useOnFinish } from 'hooks/useOnFinish';

const DarkModal = dynamic(
  async () => {
    const modal = await import('./darkModal').then((module) => module);
    return modal;
  },
  { ssr: false },
) as any;

export default function ETransferWithdraw() {
  const { isMD, isLG } = useResponsive();
  const cmsInfo = useCmsInfo();
  const searchParams = useSearchParams();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const { isInTG } = useTelegram();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const { checkLogin } = useCheckLoginAndToken();
  const { walletType, walletInfo } = useConnectWallet();
  useOnFinish();

  const defaultParams = useMemo(() => {
    return {
      tokenSymbol: searchParams.get('tokenSymbol'),
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

  useEffect(() => {
    if (isLogin) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [isLogin]);

  useEffect(() => {
    ETransferConfig.setConfig({
      withdrawConfig: {
        defaultToken: defaultParams.tokenSymbol || 'ELF',
        defaultChainId: cmsInfo?.curChain || 'tDVV',
        // supportTokens: ['ELF', 'SGR-1'],
        defaultNetwork: 'AELF',
        supportChainIds: cmsInfo?.curChain === 'tDVW' ? ['tDVW'] : ['tDVV'],
      },
    });
  }, [cmsInfo?.curChain, defaultParams, walletInfo?.address, walletType]);

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  if (loading) return null;

  return (
    <div
      className={clsx(
        'm-auto max-w-[1024px] relative',
        styles['etransfer-withdraw-wrap'],
        isInTG && styles['etransfer-withdraw-wrap-dark'],
      )}>
      {isLG || !isLogin ? null : (
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
          <div className="w-full relative flex justify-between items-center">
            <span
              className={clsx(
                'text-lg font-semibold flex justify-center items-center w-full px-[40px]',
                isInTG ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
              )}>
              Withdraw Assets
            </span>
            {isLogin ? (
              <Link href={'/etransfer-history'} className="absolute top-0 bottom-0 my-auto right-0 pl-[16px]">
                <HistoryOutlined className={clsx(isInTG ? 'fill-pixelsTertiaryTextPurple' : 'fill-brandDefault')} />
              </Link>
            ) : null}
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
                title: <div>Withdraw Assets</div>,
              },
            ]}
          />
        </div>
      )}
      {showLogin && !isLogin ? (
        <div className="w-full flex flex-col justify-center items-center h-[300px] mt-[40px] lg:mt-0 lg:h-[600px]">
          <div className="text-3xl lg:text-4xl text-neutralPrimary font-semibold">Login Schrodinger</div>
          <div className="text-base lg:text-lg text-neutralSecondary mt-[16px] text-center">
            Log in Schrodinger with your wallet, and authorize the USDT deposit via Etransfer.
          </div>
          <Button type="primary" className="w-[206px] !rounded-lg mt-[32px]" onClick={() => checkLogin()}>
            Login
          </Button>
        </div>
      ) : null}
      {isLogin ? (
        <ETransferWithdrawProvider>
          <Withdraw
            componentStyle={isMD ? ComponentStyle.Mobile : ComponentStyle.Web}
            isShowErrorTip={true}
            isShowMobilePoweredBy={false}
            isListenNoticeAuto={true}
            isShowProcessingTip={true}
          />
        </ETransferWithdrawProvider>
      ) : null}
    </div>
  );
}
