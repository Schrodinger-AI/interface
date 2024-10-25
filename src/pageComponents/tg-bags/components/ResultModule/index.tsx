import { Flex, Tooltip } from 'antd';
import TGButton from 'components/TGButton';
import { ReactComponent as ConfirmSVG } from 'assets/img/telegram/spin/Confirm.svg';
import { ReactComponent as UnboxSVG } from 'assets/img/telegram/spin/Unbox.svg';
import { ReactComponent as StrongSVG } from 'assets/img/telegram/spin/Strong.svg';
import { ReactComponent as CongratulationsSVG } from 'assets/img/telegram/spin/Congratulations.svg';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import SkeletonImage from 'components/SkeletonImage';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { TModalTheme } from 'components/CommonModal';
import TraitsList from 'components/TraitsList';
import { ITrait } from 'types/tokens';

type IProps = { data?: ISpinPrizesPoolItem; traits: ITrait[]; isRare: boolean; theme?: TModalTheme };

interface IDescriptionItemProps extends PropsWithChildren {
  title: string;
  theme?: TModalTheme;
  tip?: string | React.ReactNode;
}

function DescriptionItem({ title, tip, children, theme }: IDescriptionItemProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-2">
        <div className={clsx('text-lg font-medium', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
          {title}
        </div>
        {tip && (
          <Tooltip title={tip}>
            <QuestionSVG className="fill-pixelsWhiteBg" />
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
}

const commonItem = {
  amount: 99999,
  describe: 'Common,,',
  generation: 9,
  inscriptionImageUri: 'https://schrodinger-testnet.s3.amazonaws.com/30b0a134-ca62-46ea-98fa-b079ae992b2c.png',
};

export function ResultModule({ data = commonItem, traits, isRare, theme }: IProps) {
  return (
    <div className="p-[8px]">
      <Flex align="center" gap={24} vertical>
        <Flex align="stretch" gap={16} className="p-[16px] bg-pixelsModalTextBg rounded-[8px]">
          <div className="flex items-center w-[24px] shrink">{isRare ? <CongratulationsSVG /> : <StrongSVG />}</div>
          <p className="text-white leading-[22px] text-[14px] font-medium ">
            {isRare ? 'Congratulations!/n Your cat is ready for adoption.' : 'Keep trying to get Rare GEN9 cats!'}
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
        <DescriptionItem title="Traits" theme={theme}>
          <TraitsList data={traits} theme={theme} />
        </DescriptionItem>
        <Flex gap={10} className="w-full">
          <TGButton type="success" className="flex-1">
            <ConfirmSVG />
          </TGButton>
          {isRare && (
            <TGButton className="flex-1">
              <UnboxSVG />
            </TGButton>
          )}
        </Flex>
      </Flex>
    </div>
  );
}
