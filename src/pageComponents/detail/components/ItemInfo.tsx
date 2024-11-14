import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import { TSGRToken } from 'types/tokens';
import { formatNumber, formatTokenPrice } from 'utils/format';
import { ReactComponent as RightArrowSVG } from 'assets/img/right_arrow.svg';
import { useModal } from '@ebay/nice-modal-react';
import LearnMoreModal from 'components/LearnMoreModal';
import { useCallback, useMemo } from 'react';
import { divDecimals } from 'utils/calculate';
import { ONE } from 'constants/misc';
import { Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import HonourLabel from 'components/ItemCard/components/HonourLabel';
import { renameSymbol } from 'utils/renameSymbol';
import TraitsCard from 'components/TraitsCard';
import { TModalTheme } from 'components/CommonModal';

export default function ItemInfo({
  detail,
  rankInfo,
  onAdoptNextGeneration,
  showAdopt,
  source,
  theme = 'light',
  isBlind = false,
}: {
  detail: TSGRToken;
  rankInfo?: TRankInfoAddLevelInfo;
  onAdoptNextGeneration: () => void;
  showAdopt?: boolean;
  theme?: TModalTheme;
  source?: string | null;
  isBlind?: boolean;
}) {
  const learnMoreModal = useModal(LearnMoreModal);
  const onLearnMoreClick = useCallback(() => {
    learnMoreModal.show({
      item: {
        ...detail,
        symbol: renameSymbol(detail.symbol) || '',
        rank: rankInfo?.rank,
      },
    });
  }, [detail, learnMoreModal, rankInfo?.rank]);
  const { isLG } = useResponsive();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const isLearnMoreShow = useMemo(
    () => detail.generation === 0 || divDecimals(detail.amount, detail.decimals).gte(ONE),
    [detail.amount, detail.decimals, detail.generation],
  );

  const traits = useCallback(() => {
    return (
      <Row gutter={[16, 16]}>
        {detail.traits.map((item) => (
          <TraitsCard key={item.traitType} item={item} theme={theme} />
        ))}
      </Row>
    );
  }, [detail.traits, theme]);

  const noTraits = () => {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <div
          className={clsx(
            'font-medium	text-lg text-center mt-[10px]',
            isDark ? 'text-pixelsDivider' : 'text-neutralSecondary',
          )}>
          This is a Gen0 cat without any traits. <br />
          Click &quot;Instant Gen9&quot; to level up to Gen9 with 11 new traits. <br />
          Good luck in unboxing a Rare Cat with a special rarity badge, and enjoying potential instant profits for
          resale.
        </div>
        {/* {showAdopt && (
          <Button
            type="primary"
            className={clsx('mr-[12px] mt-[24px] mb-[56px] w-[239px]', isDark ? '!primary-button-dark' : '!rounded-lg')}
            size="large"
            onClick={onAdoptNextGeneration}>
            Instant GEN9
          </Button>
        )} */}
      </div>
    );
  };

  const levelInfoToken = useMemo(() => {
    if (isLG) {
      return formatNumber(rankInfo?.levelInfo?.token || '');
    } else {
      return formatTokenPrice(rankInfo?.levelInfo?.token || '');
    }
  }, [rankInfo?.levelInfo?.token, isLG]);

  const awakenPrice = useMemo(() => {
    if (isLG) {
      return formatNumber(rankInfo?.levelInfo?.awakenPrice || '');
    } else {
      return formatTokenPrice(rankInfo?.levelInfo?.awakenPrice || '');
    }
  }, [rankInfo?.levelInfo?.awakenPrice, isLG]);

  return (
    <div className="flex flex-col w-full flex-none lg:flex-1 mt-[16px] lg:mt-[0px]">
      <div
        className={clsx(
          'w-full border p-4',
          isDark
            ? ' border-pixelsPrimaryTextPurple rounded-none border-dashed bg-pixelsModalBg'
            : 'border-neutralBorder rounded-lg border-solid',
        )}>
        <div className="flex flex-row justify-between items-center">
          <div className={clsx('font-medium	text-[20px] leading-[28px]', isDark ? 'dark-title' : 'text-neutralTitle')}>
            Info
          </div>
          {rankInfo?.levelInfo?.describe && (
            <HonourLabel
              text={rankInfo?.levelInfo?.describe}
              className={clsx(isDark ? 'bg-transparent' : 'bg-white')}
            />
          )}
        </div>
        <div className="flex flex-row justify-between items-center mt-3 text-lg font-normal">
          <div className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>Generation</div>
          <div className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
            {detail.generation}
          </div>
        </div>
        {rankInfo?.levelInfo?.level && (
          <div className="flex flex-row justify-between items-center mt-2 text-lg font-normal">
            <div className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>Level</div>
            <div className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              Lv. {rankInfo?.levelInfo?.level}
            </div>
          </div>
        )}
        {!!rankInfo?.rank && (
          <div className="flex flex-row justify-between items-center mt-2 text-lg font-normal">
            <div className={clsx(isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>Rank</div>
            <div className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
              {formatTokenPrice(rankInfo.rank)}
            </div>
          </div>
        )}
        {(rankInfo?.levelInfo?.token || rankInfo?.levelInfo?.awakenPrice) && !isBlind && (
          <div className="flex flex-row justify-between items-start mt-2 text-lg font-normal">
            <div
              className={clsx('max-w-[170px] md:max-w-max', isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
              Recommended Price
            </div>
            <div className="flex flex-col items-end">
              {rankInfo?.levelInfo?.token && (
                <div className={clsx('font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                  {levelInfoToken} SGR
                </div>
              )}
              {rankInfo?.levelInfo?.awakenPrice && (
                <div className={clsx('font-medium text-base', isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}>
                  {awakenPrice} ELF
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className={clsx(
          'w-full border flex flex-col mt-[16px]',
          isDark
            ? ' border-pixelsPrimaryTextPurple rounded-none border-dashed bg-pixelsModalBg'
            : 'border-neutralBorder rounded-lg border-solid',
        )}>
        <div className="w-full h-[72px] flex flex-row justify-between items-center p-[24px]">
          <div className={clsx('font-medium	text-lg', isDark ? 'dark-title' : 'text-neutralTitle')}>Traits</div>
          {/* <ArrowSVG className={clsx('size-4', 'mr-[16px]', { ['common-revert-180']: true })} /> */}
        </div>
        <div className="px-[16px] pb-[16px] w-full overflow-hidden">
          {detail.generation == 0 ? noTraits() : traits()}
        </div>
      </div>
      {isLearnMoreShow && !source && (
        <div className="flex justify-end mt-[16px]">
          <div className="cursor-pointer flex items-center" onClick={onLearnMoreClick}>
            <span className="text-brandDefault text-sm font-medium">Learn More</span>
            <RightArrowSVG className="w-[14px] h-[14px] ml-[8px] fill-brandDefault" />
          </div>
        </div>
      )}
    </div>
  );
}
