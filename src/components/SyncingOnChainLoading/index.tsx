import { LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonProgress from 'components/CommonProgress';
import TgModal from 'components/TgModal';
import useGetProgressPercent from 'hooks/useGetProgressPercent';
import { useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

function SyncingOnChainLoading({
  checkLogin,
  checkLoginOnChainStatus,
}: {
  checkLoginOnChainStatus?: boolean;
  checkLogin?: boolean;
}) {
  const { percent, onFinish } = useGetProgressPercent();
  const { isLogin } = useGetLoginStatus();
  const { loginOnChainStatus } = useConnectWallet();
  const modal = useModal();

  useEffect(() => {
    if (loginOnChainStatus === LoginStatusEnum.SUCCESS && checkLoginOnChainStatus) {
      onFinish();
      modal.hide();
    }
  }, [checkLoginOnChainStatus, loginOnChainStatus, modal, onFinish]);

  useEffect(() => {
    if (isLogin && checkLogin) {
      onFinish();
      modal.hide();
    }
  }, [checkLogin, isLogin, loginOnChainStatus, modal, onFinish]);

  return (
    <TgModal open={modal.visible} onCancel={modal.hide} afterClose={modal.remove} title="Loading">
      <div className="w-full px-[16px]">
        <span className="inline-block w-full text-pixelsWhiteBg text-center text-sm font-semibold mb-[24px]">
          Syncing on-chain account info.....
        </span>
        <CommonProgress percent={percent} />
      </div>
    </TgModal>
  );
}

export default NiceModal.create(SyncingOnChainLoading);
