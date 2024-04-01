import { Row, Col } from 'antd';
import clsx from 'clsx';
import NewIcon from 'components/NewIcon';
import { ITrait } from 'types/tokens';
import useResponsive from 'hooks/useResponsive';
import { useMemo } from 'react';
import { formatPercent } from 'utils/format';
import TextEllipsis from 'components/TextEllipsis';
import BigNumber from 'bignumber.js';

interface ITraitItem {
  item: ITrait;
  isLG: boolean;
  showNew?: boolean;
  traitsProbability?: number;
}

interface ITraitsListProps {
  data: ITrait[];
  rankInfo?: IRankInfo;
  showNew?: boolean;
}

function TraitsItem({ item, showNew, isLG, traitsProbability }: ITraitItem) {
  const { traitType, value, percent } = item;
  const traitsProbabilityStr = traitsProbability
    ? ` (${Number(BigNumber(traitsProbability).multipliedBy(100).toFixed(2))}%)`
    : '';
  return (
    <div
      className={clsx(
        'relative flex flex-col justify-center py-[6px] px-[12px] bg-neutralDefaultBg rounded-md font-medium text-center text-xs text-neutralSecondary',
        !showNew && !isLG && 'px-[8px]',
      )}>
      <TextEllipsis value={traitType} />
      <TextEllipsis className="text-sm text-neutralTitle" value={value} />
      <div>
        {formatPercent(percent)}%{`${traitsProbabilityStr}`}
      </div>
      {showNew && <NewIcon className="absolute top-[-3px] right-[-8px]" />}
    </div>
  );
}

export default function TraitsList({ data = [], showNew = false, rankInfo }: ITraitsListProps) {
  const { isLG } = useResponsive();
  const colSpan = useMemo(() => {
    if (isLG) return 24;
    if (showNew) return 8;
    return 6;
  }, [isLG, showNew]);

  return (
    <Row gutter={[16, 16]}>
      {data.map((item, index) => (
        <Col span={colSpan} key={index}>
          <TraitsItem
            item={item}
            showNew={showNew}
            isLG={isLG}
            traitsProbability={rankInfo?.traitsProbability?.[item.value]}
          />
        </Col>
      ))}
    </Row>
  );
}
