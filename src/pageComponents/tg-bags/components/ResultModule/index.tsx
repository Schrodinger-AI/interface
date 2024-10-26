/* eslint-disable @next/next/no-img-element */
import { Collapse, Flex } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/icon_arrow.svg';
import SkeletonImage from 'components/SkeletonImage';
import { TModalTheme } from 'components/CommonModal';
import TraitsList from 'components/TraitsList';
import styles from './index.module.css';
import { IVoucherInfo } from 'types';
import HonourLabel from 'components/ItemCard/components/HonourLabel';
import { labelStyle } from 'components/SkeletonImage/config';
import clsx from 'clsx';

type IProps = {
  traitData?: IAdoptImageInfo;
  isRare: boolean;
  voucherInfo: IVoucherInfo;
  catsRankProbability: TRankInfoAddLevelInfo[] | false;
  theme?: TModalTheme;
};

const commonItem = {
  adoptImageInfo: {
    describe: 'Common,,',
    images: [],
    attributes: [],
    generation: 9,
    boxImage: 'https://schrodinger-testnet.s3.amazonaws.com/30b0a134-ca62-46ea-98fa-b079ae992b2c.png',
  },
  image: '',
  signature: '',
  imageUri: '',
};

function replaceLastFiveWithDots(str: string) {
  if (str.length <= 5) {
    return str;
  }
  return str.slice(0, -5) + '...';
}

export function ResultModule({ traitData = commonItem, isRare, catsRankProbability, theme = 'dark' }: IProps) {
  const { adoptImageInfo } = traitData;

  return (
    <>
      <Flex align="stretch" gap={16} className="p-[16px] bg-pixelsModalTextBg rounded-[8px]">
        <div className="flex items-center w-[24px] shrink">
          {!isRare ? (
            <img
              src={require('assets/img/telegram/spin/Strong.png').default.src}
              alt=""
              className="w-[24px] h-[24px] z-10"
            />
          ) : (
            <img
              src={require('assets/img/telegram/spin/Congratulations.png').default.src}
              alt=""
              className="w-[24px] h-[24px] z-10"
            />
          )}
        </div>
        <p className="text-white leading-[22px] text-[14px] font-medium ">
          {isRare ? 'Congratulations!/n Your cat is ready for adoption.' : 'Keep trying to get Rare GEN9 cats!'}
        </p>
      </Flex>
      <SkeletonImage
        img={adoptImageInfo?.boxImage}
        tag={`GEN ${adoptImageInfo?.generation}`}
        rarity={catsRankProbability && catsRankProbability?.[0]?.levelInfo?.describe}
        imageSizeType="contain"
        className="mt-[16px] !rounded-[8px] shadow-btnShadow"
        imageClassName="!rounded-[4px]"
        tagPosition="small"
      />

      {isRare && (
        <div className="mt-[16px] bg-pixelsHover shadow-collapseShadow rounded-[8px] px-[16px] py-[12px]">
          <Flex align="center" justify="space-between">
            <span className="text-[16px] font-black text-white py-[7px]">Info</span>
            {catsRankProbability && (
              <div
                className={clsx(
                  'flex justify-center items-center',
                  labelStyle.rarity.size['default'],
                  labelStyle.rarity.position['small'],
                )}>
                <HonourLabel text={catsRankProbability?.[0]?.levelInfo?.describe} />
              </div>
            )}
          </Flex>
          <Flex align="center" justify="space-between">
            <span className="text-[14px] leading-[22px] text-pixelsDivider py-[7px] font-bold">Name</span>
            {catsRankProbability && (
              <span className="text-[14px] leading-[22px] text-pixelsDivider font-semibold">
                {replaceLastFiveWithDots(traitData?.adoptImageInfo?.tokenName || '')}
              </span>
            )}
          </Flex>
        </div>
      )}

      <Collapse
        className={styles.collapse}
        defaultActiveKey={['Traits']}
        expandIcon={({ isActive }) => <ArrowSVG className={isActive ? '' : 'rotate-180'} />}
        expandIconPosition="end"
        items={[
          {
            key: 'Traits',
            label: 'Traits',
            children: (
              <TraitsList data={traitData?.adoptImageInfo?.attributes} theme={theme} className="!rounded-[8px]" />
            ),
          },
        ]}
      />
    </>
  );
}
