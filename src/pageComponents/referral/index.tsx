import { useTimeoutFn } from 'react-use';
import { GetJoinRecord } from 'contract/schrodinger';
import { useWalletService } from 'hooks/useWallet';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useLoading from 'hooks/useLoading';
import { ReactComponent as CopyIcon } from 'assets/img/copy.svg';
import { useCopyToClipboard } from 'react-use';
import { message } from 'antd';
import { QRCode } from 'react-qrcode-logo';

function Referral() {
  const { wallet, isLogin } = useWalletService();
  const [, setCopied] = useCopyToClipboard();

  const { showLoading, closeLoading, visible } = useLoading();

  const router = useRouter();

  const checkJoined = useCallback(async () => {
    try {
      if (!wallet.address) {
        router.push('/');
        return;
      }
      const isJoin = await GetJoinRecord(wallet.address);
      if (!isJoin) {
        router.push('/');
      }
    } catch (error) {
      router.push('/');
    } finally {
      closeLoading();
    }
  }, [closeLoading, router, wallet.address]);

  useTimeoutFn(() => {
    showLoading();
    if (!isLogin) {
      closeLoading();
      router.push('/');
    } else {
      checkJoined();
    }
  }, 3000);

  if (visible) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px] pt-[24px] lg:pt-[48px] flex flex-col items-center">
        <h1 className="text-[48px] text-neutralTitle text-center">Invite Your Friends to Schrodinger</h1>
        <p className="text-[24px] text-neutralSecondary text-center">Both you and your friends could get points!</p>
        <p>
          <CopyIcon
            className="hover:fill-brandDefault cursor-pointer"
            onClick={() => {
              setCopied('copy content');
              message.success('Copied');
            }}
          />
        </p>
        <QRCode value="https://schrodingerai.com/" logoImage="" />
      </div>
    </div>
  );
}

export default Referral;
