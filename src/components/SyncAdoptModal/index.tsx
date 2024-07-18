import NoticeBar from 'components/NoticeBar';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import Loading from 'components/Loading';
import clsx from 'clsx';
import Image from 'next/image';
import loadingCat from 'assets/img/loading-cat.gif';

function SyncAdoptModal({
  closable = false,
  innerText = "Please don't close this window until you complete the adoption.",
  showLoading = true,
  theme = 'light',
  onCancel,
}: {
  closable: boolean;
  innerText: string;
  showLoading: boolean;
  theme?: TModalTheme;
  onCancel: () => void;
}) {
  const modal = useModal();
  return (
    <CommonModal
      centered
      open={modal.visible}
      closable={closable}
      maskClosable={true}
      onCancel={onCancel}
      afterClose={modal.remove}
      theme={theme}
      disableMobileLayout={true}
      title={'Adopt Cats'}
      footer={null}>
      <div className="flex flex-col gap-6">
        {theme === 'dark' ? (
          <div className="w-full flex justify-center items-center">
            <Image src={loadingCat} width={120} height={120} alt={'loading'} />
          </div>
        ) : null}

        <NoticeBar text={innerText} theme={theme} />
        {showLoading && (
          <div className="flex justify-center items-center gap-2">
            <div
              className={clsx(
                'text-base text-center',
                theme === 'dark' ? 'text-pixelsSecondaryTextPurple' : 'text-neutralSecondary',
              )}>
              Generate your NFT image using AI
            </div>
            <Loading size="small" color={theme === 'dark' ? 'purple' : 'blue'} />
          </div>
        )}
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(SyncAdoptModal);
