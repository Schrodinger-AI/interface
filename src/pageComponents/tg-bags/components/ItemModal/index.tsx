/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';
import { throttle } from 'lodash-es';
import useAdoptWithVoucher from 'hooks/useAdoptWithVoucher';
import TGAdoptLoading from 'components/TGAdoptLoading';

function ItemModal({ amount, onConfirm, onClose }: { amount: number; onConfirm: () => void; onClose: () => void }) {
  const modal = useModal();
  const { adoptWithVoucher } = useAdoptWithVoucher();
  const tgAdoptLoading = useModal(TGAdoptLoading);

  const handleAdopt = throttle(
    async () => {
      try {
        tgAdoptLoading.show();
        await adoptWithVoucher({ tick: 'SGR' });
        onConfirm();
        console.log('adopt success');
        tgAdoptLoading.hide();
      } catch (error) {
        /* empty */
      }
    },
    700,
    { trailing: false },
  );

  const handleClose = () => {
    onClose();
    modal.remove();
  };

  return (
    <TgModal
      title="DETAILS"
      open={modal.visible}
      hideHeader={false}
      maskClosable={false}
      afterClose={handleClose}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}>
      <div className="p-[8px]">
        <Flex align="center" gap={24} vertical>
          <img
            src={require('assets/img/telegram/spin/ticket.png').default.src}
            alt=""
            className="w-[140px] h-[140px] rounded-[8px] z-10"
          />
          <Flex gap={4} align="center" vertical>
            <p className="text-[16px] leading-[24px] text-white font-black font-bold dark-btn-font">S-CAT Voucher</p>
            <p className="text-center text-white text-[14px] font-semibold">Quantity: {amount}</p>
          </Flex>
          <p className="text-center leading-[20px] text-white text-[12px] font-medium">
            Use your voucher to adopt a GEN9 cat for free! You get to keep Rare GEN9 cats, but be aware that Common GEN9
            cats will run off and disappear.
          </p>
          <p className="text-center leading-[20px] text-white text-[12px] font-medium">Good luck!</p>
        </Flex>
        <TGButton type="success" size="large" className="w-full mt-[24px]" onClick={handleAdopt}>
          Adopt
        </TGButton>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(ItemModal);
