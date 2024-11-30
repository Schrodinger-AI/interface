/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';

function AdoptVouchersModal({ voucherAmount }: { voucherAmount: number }) {
  const modal = useModal();

  return (
    <TgModal
      title="Reward"
      open={modal.visible}
      hideHeader={false}
      afterClose={modal.remove}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}>
      <div className="p-[8px]">
        <Flex align="center" gap={24} vertical>
          <p className="text-[16px] leading-[24px] text-white font-bold dark-btn-font">
            You got {voucherAmount}* Free S-CAT Voucher!
          </p>
          <img
            src={require('assets/img/telegram/spin/ticket.png').default.src}
            alt=""
            className="w-[140px] h-[140px] rounded-[8px] z-10"
          />
          <p className="text-center leading-[20px] text-white text-[12px] font-medium">
            Check your bags for the S-CAT voucher and use it to adopt a GEN9 cat for free! Adopt more with SGR to earn
            FREE vouchers.
          </p>
        </Flex>
        <TGButton type="success" size="large" className="w-full mt-[24px]" onClick={() => modal.hide()}>
          Confirm
        </TGButton>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(AdoptVouchersModal);
