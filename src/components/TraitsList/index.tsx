import { Row, Col } from 'antd';
import clsx from 'clsx';
import NewIcon from 'components/NewIcon';
import { ITrait } from 'types/tokens';
import useResponsive from 'hooks/useResponsive';
import { useMemo } from 'react';
import { formatPercent } from 'utils/format';
import TextEllipsis from 'components/TextEllipsis';
import Image from 'next/image';

interface ITraitItem {
  item: ITrait;
  isLG: boolean;
  showNew?: boolean;
}

interface ITraitsListProps {
  data: ITrait[];
  showNew?: boolean;
}

const scarceWidth = 20;

function TraitsItem({ item, showNew, isLG }: ITraitItem) {
  const { traitType, value, percent, isRare } = item;
  return (
    <div
      className={clsx(
        'relative flex flex-col justify-center py-[6px] px-[12px] rounded-md font-medium text-center text-xs text-neutralSecondary',
        !showNew && !isLG && 'px-[8px]',
        isRare ? 'bg-[#FFF5E6]' : 'bg-neutralDefaultBg',
      )}>
      <TextEllipsis value={traitType} />
      <div className="flex justify-center mt-[8px] items-center overflow-hidden">
        <div
          className="w-auto"
          style={{
            maxWidth: isRare ? `calc(100% - ${scarceWidth + 8}px)` : '100%',
          }}>
          <TextEllipsis className="text-sm text-neutralTitle" value={value} />
        </div>

        {isRare ? (
          <Image
            src={require('assets/img/icons/scarce.svg').default}
            width={scarceWidth}
            height={scarceWidth}
            alt="scarce"
            className="ml-[8px]"
          />
        ) : null}
      </div>

      <div>{formatPercent(percent)}%</div>
      {showNew && <NewIcon className="absolute top-[-3px] right-[-8px]" />}
    </div>
  );
}

export default function TraitsList({ data = [], showNew = false }: ITraitsListProps) {
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
          <TraitsItem item={item} showNew={showNew} isLG={isLG} />
        </Col>
      ))}
    </Row>
  );
}
