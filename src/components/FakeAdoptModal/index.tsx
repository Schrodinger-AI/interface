/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Flex } from 'antd';
import { throttle } from 'lodash-es';
import TGAdoptLoading from 'components/TGAdoptLoading';
import FakeAdoptResultModal from 'components/FakeAdoptResultModal';
import { sleep } from '@portkey/utils';

function FakeAdoptModal() {
  const modal = useModal();
  const tgAdoptLoading = useModal(TGAdoptLoading);
  const fakeAdoptResultModal = useModal(FakeAdoptResultModal);

  const handleAdopt = throttle(
    async () => {
      modal.hide();
      tgAdoptLoading.show();
      await sleep(5000);
      fakeAdoptResultModal.show();
      tgAdoptLoading.hide();
    },
    700,
    { trailing: false },
  );

  return (
    <TgModal
      title="REWARD"
      open={modal.visible}
      hideHeader={false}
      afterClose={modal.remove}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}>
      <div className="p-[8px]">
        <Flex align="center" gap={24} vertical>
          <p className="text-[16px] leading-[24px] text-white font-black font-bold dark-btn-font">
            Lucky! You won 1 * S-CAT Voucher!
          </p>
          <img
            src={require('assets/img/telegram/spin/ticket.png').default.src}
            alt=""
            className="w-[140px] h-[140px] rounded-[8px] z-10"
          />
          <p className="text-center leading-[20px] text-white text-[12px] font-medium">
            Use your voucher to adopt a GEN9 cat for free! You get to keep Rare GEN9 cats, but be aware that Common GEN9
            cats will run off and disappear.
          </p>
          <p className="text-center leading-[20px] text-white text-[12px] font-medium">Good luck!</p>

          <Flex align="stretch" gap={16} className="mt-[16px] p-[16px] bg-pixelsModalTextBg rounded-[8px]">
            <div className="flex items-center w-[20px] shrink">
              <img src={require('assets/img/info.png').default.src} alt="" className="w-[20px] h-[20px] z-10" />
            </div>
            <p className="text-white leading-[22px] text-[14px] font-medium ">
              If you close this pop-up, you will lose this S-CAT voucher.
            </p>
          </Flex>
        </Flex>
        <TGButton type="success" size="large" className="w-full mt-[24px]" onClick={handleAdopt}>
          Adopt
        </TGButton>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(FakeAdoptModal);
