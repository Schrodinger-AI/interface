/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';
import { ReactComponent as AdoptSVG } from 'assets/img/telegram/spin/Adopt.svg';
import { ReactComponent as VoucherSVG } from 'assets/img/telegram/spin/Voucher.svg';
import { throttle } from 'lodash-es';
import useAdoptWithVoucher from 'hooks/useAdoptWithVoucher';
import TGAdoptLoading from 'components/TGAdoptLoading';

function ItemModal({ quantity }: { quantity: string }) {
  const modal = useModal();
  const { adoptWithVoucher } = useAdoptWithVoucher();
  const tgAdoptLoading = useModal(TGAdoptLoading);

  const handleAdopt = throttle(
    async () => {
      try {
        tgAdoptLoading.show();
        const data = await adoptWithVoucher({ tick: 'SGR' });
        tgAdoptLoading.hide();
        console.log(data);
      } catch (error) {
        /* empty */
      }
    },
    700,
    { trailing: false },
  );

  return (
    <TgModal
      title="Notice"
      open={modal.visible}
      hideHeader={false}
      afterClose={modal.remove}
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
            <VoucherSVG />
            <p className="text-center text-white text-[14px] font-semibold">Quantity: {quantity}</p>
          </Flex>
          <p className="text-center leading-[20px] text-white text-[12px] font-medium">
            Use your voucher to adopt a GEN9 cat for free! You get to keep Rare GEN9 cats, but be aware that Common GEN9
            cats will run off and disappear.
          </p>
          <p className="text-center leading-[20px] text-white text-[12px] font-medium">Good luck!</p>
        </Flex>
        <TGButton type="success" className="w-full mt-[24px]" onClick={handleAdopt}>
          <AdoptSVG />
        </TGButton>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(ItemModal);
