import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Flex } from 'antd';
import { ReactComponent as SpinSVG } from 'assets/img/telegram/spin/Spin.svg';
import { ReactComponent as AdoptSVG } from 'assets/img/telegram/spin/Adopt.svg';
import ticketIcon from 'assets/img/telegram/spin/ticket.png';
import prizeIcon from 'assets/img/telegram/spin/prize.png';
import Image from 'next/image';
import clsx from 'clsx';
import useAdoptWithVoucher from 'hooks/useAdoptWithVoucher';
import { SpinRewardType } from 'types';
import { formatNumber } from 'utils/format';

function SpinResultModal({
  type,
  amount,
  tick,
  onSpin,
}: {
  type: SpinRewardType;
  amount: string;
  tick: string;
  onSpin?: () => void;
}) {
  const modal = useModal();
  const pathname = usePathname();
  const { adoptWithVoucher } = useAdoptWithVoucher();

  const content = useMemo(() => {
    switch (type) {
      case SpinRewardType.AdoptionVoucher:
        return {
          subTitle: `You won ${formatNumber(amount)} S-Cat Voucher!`,
          description: [
            'Use your voucher to adopt a GEN9 cat for free! You get to keep Rare GEN9 cats, but be aware that Common GEN9 cats will run off and disappear.',
            'Good luck!',
          ],
          rewardImg: ticketIcon,
          imageClassName: 'w-[140px] h-[140px]',
          button: {
            text: <AdoptSVG />,
            onClick: () => {
              adoptWithVoucher({
                tick,
              });
            },
          },
        };
      case SpinRewardType.Point:
        return {
          subTitle: `You won ${formatNumber(amount)} $Fish!`,
          description: ['Ready for your next spin?'],
          rewardImg: prizeIcon,
          imageClassName: 'w-[96px] h-[96px]',
          button: {
            text: <SpinSVG />,
            onClick: () => {
              onSpin && onSpin();
            },
          },
        };
      default:
        return {
          subTitle: '',
          description: [''],
          rewardImg: null,
        };
    }
  }, [type, amount, adoptWithVoucher, tick, onSpin]);

  useEffect(() => {
    modal.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
          <p className="text-center text-white leading-[22px] text-[14px] font-medium">{content.subTitle}</p>
          {content.rewardImg ? (
            <Image
              src={content.rewardImg}
              alt=""
              className={clsx('w-[96px] h-[96px] rounded-[8px] z-10', content.imageClassName)}
            />
          ) : null}

          {content?.description?.map((item, index) => {
            return (
              <p key={index} className="text-center text-white text-[12px] font-medium">
                {item}
              </p>
            );
          })}
        </Flex>
        <TGButton
          type="success"
          className="w-full mt-[24px]"
          onClick={() => {
            modal.hide();
            content.button?.onClick && content.button?.onClick();
          }}>
          {content.button?.text}
        </TGButton>
      </div>
    </TgModal>
  );
}

export default NiceModal.create(SpinResultModal);
