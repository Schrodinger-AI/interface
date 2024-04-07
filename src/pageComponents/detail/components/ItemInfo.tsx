import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import { ITrait, TSGRToken } from 'types/tokens';
import { formatPercent, formatTokenPriceOnItemCard } from 'utils/format';
import { ReactComponent as RightArrowSVG } from 'assets/img/right_arrow.svg';
import { useModal } from '@ebay/nice-modal-react';
import LearnMoreModal from 'components/LearnMoreModal';
import { useCallback, useMemo } from 'react';
import { divDecimals } from 'utils/calculate';
import { ONE } from 'constants/misc';
import { Col, Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import TextEllipsis from 'components/TextEllipsis';
import { getRankInfoToShow } from 'utils/formatTraits';
import BigNumber from 'bignumber.js';
import HonourLabel from 'components/ItemCard/components/HonourLabel';

export default function ItemInfo({
  detail,
  rankInfo,
  onAdoptNextGeneration,
}: {
  detail: TSGRToken;
  rankInfo?: IRankInfo;
  onAdoptNextGeneration: () => void;
}) {
  const learnMoreModal = useModal(LearnMoreModal);
  const onLearnMoreClick = useCallback(() => {
    learnMoreModal.show({
      item: detail,
    });
  }, [detail, learnMoreModal]);
  const { isLG } = useResponsive();

  const isLearnMoreShow = useMemo(
    () => detail.generation === 0 || divDecimals(detail.amount, detail.decimals).gte(ONE),
    [detail.amount, detail.decimals, detail.generation],
  );

  const renderTraitsCard = useCallback(
    (item: ITrait) => {
      const traitsProbability = rankInfo?.traitsProbability[item.value]
        ? Number(BigNumber(rankInfo?.traitsProbability[item.value]).multipliedBy(100).toFixed(2))
        : '';
      const traitsProbabilityStr = `${traitsProbability ? `(${traitsProbability}%)` : ''}`;
      return (
        <Col span={isLG ? 24 : 8} key={item.traitType} className="px-[8px]">
          <div className="flex flex-row lg:flex-col justify-center items-end lg:items-center bg-[#FAFAFA] overflow-hidden rounded-lg cursor-default py-[16px] lg:py-[24px] !px-[24px]">
            <div key={item.traitType} className="flex-1 lg:flex-none lg:w-full overflow-hidden mr-[16px] lg:mr-0">
              <TextEllipsis
                value={item.traitType}
                className="text-[#919191] text-left lg:text-center font-medium text-sm"
              />
              <TextEllipsis
                value={item.value}
                className="w-full text-left lg:text-center mt-[8px] text-[#1A1A1A] font-medium text-xl"
              />
            </div>

            <div className="mt-[8px] text-[#919191] flex justify-end lg:justify-center font-medium text-base">
              {`${formatPercent(item.percent)}% ${traitsProbabilityStr}`}
            </div>
          </div>
        </Col>
      );
    },
    [isLG, rankInfo?.traitsProbability],
  );

  const traits = () => {
    return <Row gutter={[16, 16]}>{detail.traits.map((item) => renderTraitsCard(item))}</Row>;
  };

  const noTraits = () => {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <div className="text-[#919191] font-medium	text-lg text-center mt-[10px]">
          Seems like this is a gen0 kitten with no traits. <br />
          Take this kitten to the next level by adopting a next-gen cat, <br />
          generating brand new and unpredictable traits.
        </div>
        <Button
          type="primary"
          className="!rounded-lg mr-[12px] mt-[24px] mb-[56px] w-[239px]"
          size="large"
          onClick={onAdoptNextGeneration}>
          Adopt Next-Gen Cat
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full flex-none lg:flex-1 mt-[16px] lg:mt-[0px]">
      <div className="w-full rounded-2xl border-solid border border-[#E1E1E1] p-4">
        <div className="flex flex-row justify-between items-center">
          <div className="text-[#1A1A1A] font-medium	text-[20px] leading-[28px]">Info</div>
          {rankInfo?.levelInfo.describe && <HonourLabel text={rankInfo?.levelInfo.describe} className="bg-white" />}
        </div>
        <div className="flex flex-row justify-between items-center mt-3 text-lg font-normal">
          <div className="text-[#919191]">Amount Owned</div>
          <div className="text-[#1A1A1A] font-medium">{divDecimals(detail.amount, detail.decimals).toFixed()}</div>
        </div>
        <div className="flex flex-row justify-between items-center mt-2 text-lg font-normal">
          <div className="text-[#919191]">Generation</div>
          <div className="text-[#1A1A1A] font-medium">{detail.generation}</div>
        </div>
        {rankInfo?.levelInfo.level && (
          <div className="flex flex-row justify-between items-center mt-2 text-lg font-normal">
            <div className="text-[#919191]">Level</div>
            <div className="text-[#1A1A1A] font-medium">Lv. {rankInfo?.levelInfo.level}</div>
          </div>
        )}
        {!!rankInfo?.rank && (
          <div className="flex flex-row justify-between items-center mt-2 text-lg font-normal">
            <div className="text-[#919191]">Rank</div>
            <div className="text-[#1A1A1A] font-medium">{getRankInfoToShow(rankInfo)}</div>
          </div>
        )}
        {(rankInfo?.levelInfo.token || rankInfo?.levelInfo.awakenPrice) && (
          <div className="flex flex-row justify-between items-start mt-2 text-lg font-normal">
            <div className="text-[#919191]">Recommended Price</div>
            <div className="flex flex-col items-end">
              {rankInfo?.levelInfo.token && (
                <div className="text-[#1A1A1A] font-medium">
                  {formatTokenPriceOnItemCard(rankInfo?.levelInfo.token)} SGR
                </div>
              )}
              {rankInfo?.levelInfo.awakenPrice && (
                <div className="font-medium text-[#919191]">
                  {formatTokenPriceOnItemCard(rankInfo?.levelInfo.awakenPrice)} ELF
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full rounded-2xl border-solid border border-[#E1E1E1] flex flex-col mt-[16px]">
        <div className="ml-[8px] w-full h-[72px] flex flex-row justify-between items-center p-[24px]">
          <div className="text-[#1A1A1A] font-medium	text-lg">Traits</div>
          <ArrowSVG className={clsx('size-4', 'mr-[16px]', { ['common-revert-180']: true })} />
        </div>
        <div className="px-[16px] pb-[16px] w-full overflow-hidden">
          {detail.generation == 0 ? noTraits() : traits()}
        </div>
      </div>
      {isLearnMoreShow && (
        <div className="flex justify-end mt-[16px]">
          <div className="cursor-pointer flex items-center" onClick={onLearnMoreClick}>
            <span className="text-[#1A1A1A] text-base">Learn More</span>
            <RightArrowSVG className="ml-[8px]" />
          </div>
        </div>
      )}
    </div>
  );
}
