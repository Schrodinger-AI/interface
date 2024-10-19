import { Flex } from 'antd';
import TGButton from 'components/TGButton';
import { ReactComponent as ConfirmSVG } from 'assets/img/telegram/spin/Confirm.svg';
import { ReactComponent as UnboxSVG } from 'assets/img/telegram/spin/Unbox.svg';
import { ReactComponent as StrongSVG } from 'assets/img/telegram/spin/Strong.svg';
import { ReactComponent as CongratulationsSVG } from 'assets/img/telegram/spin/Congratulations.svg';
import SkeletonImage from 'components/SkeletonImage';

export function ResultModule({ data }: { data?: ISpinPrizesPoolItem }) {
  return (
    <div className="p-[8px]">
      <Flex align="center" gap={24} vertical>
        <Flex align="stretch" gap={16} className="p-[16px] bg-pixelsModalTextBg rounded-[8px]">
          <div className="flex items-center w-[24px] shrink">
            <StrongSVG />
          </div>
          <p className="text-white leading-[22px] text-[14px] font-medium ">
            Congratulations! <br /> Your cat is ready for adoption.
          </p>
        </Flex>
        <SkeletonImage
          img={data?.inscriptionImageUri}
          tag={`GEN ${data?.generation}`}
          rarity={data?.describe}
          imageSizeType="contain"
          className="!rounded-[4px] border-[3px] border-solid border-pixelsWhiteBg shadow-btnShadow"
          imageClassName="!rounded-[4px]"
          tagPosition="small"
        />
        <Flex gap={10} className="w-full">
          <TGButton type="success" className="flex-1">
            <ConfirmSVG />
          </TGButton>
          <TGButton className="flex-1">
            <UnboxSVG />
          </TGButton>
        </Flex>
      </Flex>
    </div>
  );
}
