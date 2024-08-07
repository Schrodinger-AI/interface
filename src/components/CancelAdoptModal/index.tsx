/* eslint-disable react/no-unescaped-entities */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import { message } from 'antd';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import { useCallback, useState } from 'react';
import SkeletonImage from 'components/SkeletonImage';
import { IContractError } from 'types';
import { RerollAdoption } from 'contract/schrodinger';
import AdoptNextModal from 'components/AdoptNextModal';
import clsx from 'clsx';

function CancelAdoptModal({
  title,
  nftImage,
  tokenName,
  amount,
  adoptId,
  theme = 'light',
}: {
  title: string;
  nftImage: string;
  tokenName: string;
  amount: string | number;
  adoptId: string;
  theme?: TModalTheme;
}) {
  const modal = useModal();
  const adoptNextModal = useModal(AdoptNextModal);
  const [loading, setLoading] = useState<boolean>(false);

  const onCancel = () => {
    modal.hide();
  };

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await RerollAdoption(adoptId);
      modal.hide();
      adoptNextModal.hide();
      setLoading(false);
    } catch (error) {
      const resError = error as IContractError;
      setLoading(false);
      modal.hide();
      adoptNextModal.hide();
      message.error(resError.errorMessage?.message);
    }
  }, [adoptId, adoptNextModal, modal]);

  return (
    <CommonModal
      title={title}
      closable={true}
      open={modal.visible}
      onCancel={onCancel}
      afterClose={modal.remove}
      disableMobileLayout={true}
      theme={theme}
      footer={
        <div className="flex w-full justify-center">
          <Button
            className={clsx(
              'flex-1 lg:flex-none lg:w-[356px] mr-[16px]',
              theme === 'dark' ? '!primary-default-dark' : '!rounded-lg border-brandDefault text-brandDefault',
            )}
            onClick={onCancel}
            type="default">
            Cancel
          </Button>
          <Button
            loading={loading}
            className={clsx(
              'flex-1 lg:flex-none lg:w-[356px]',
              theme === 'dark' ? '!primary-button-dark' : '!rounded-lg',
            )}
            onClick={onConfirm}
            type="primary">
            Confirm
          </Button>
        </div>
      }>
      <div className="w-full flex justify-center items-center">
        <SkeletonImage img={nftImage} className="w-[180px]" />
      </div>
      <p
        className={clsx(
          'text-base lg:text-2xl font-medium text-center mt-[16px] lg:mt-[32px]',
          theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
        )}>
        Are you sure you want to reroll {tokenName} to claim {amount} $SGR?
      </p>
      <p
        className={clsx(
          'text-sm lg:text-xl text-center mt-[16px] lg:mt-[32px]',
          theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary',
        )}>
        If you reroll, your NFT will be burnt and converted into $SGR. This action cannot be undone.
      </p>
    </CommonModal>
  );
}

export default NiceModal.create(CancelAdoptModal);
