/* eslint-disable react/no-unescaped-entities */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import { message } from 'antd';
import CommonModal from 'components/CommonModal';
import { useCallback, useState } from 'react';
import SkeletonImage from 'components/SkeletonImage';
import { IContractError } from 'types';
import { RerollAdoption } from 'contract/schrodinger';
import AdoptNextModal from 'components/AdoptNextModal';

function CancelAdoptModal({
  title,
  nftImage,
  tokenName,
  amount,
  adoptId,
}: {
  title: string;
  nftImage: string;
  tokenName: string;
  amount: string | number;
  adoptId: string;
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
      footer={
        <div className="flex w-full justify-center">
          <Button
            className="flex-1 lg:flex-none lg:w-[356px] mr-[16px] !rounded-lg border-brandDefault text-brandDefault"
            onClick={onCancel}
            type="default">
            Cancel
          </Button>
          <Button
            loading={loading}
            className="flex-1 lg:flex-none lg:w-[356px] !rounded-lg"
            onClick={onConfirm}
            type="primary">
            Confirm
          </Button>
        </div>
      }>
      <div className="w-full flex justify-center items-center">
        <SkeletonImage img={nftImage} className="w-[180px]" />
      </div>
      <p className="text-neutralTitle text-base lg:text-2xl font-medium text-center mt-[16px] lg:mt-[32px]">
        Adopt {tokenName} and receive {amount} An SGR?
      </p>
      <p className="text-neutralSecondary text-sm lg:text-xl text-center mt-[16px] lg:mt-[32px]">
        Reroll will consume this NFT and restore the same amount of the original SGR, which is irreversible
      </p>
    </CommonModal>
  );
}

export default NiceModal.create(CancelAdoptModal);
