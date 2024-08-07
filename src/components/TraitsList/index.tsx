import { Row, Col } from 'antd';
import { ITrait } from 'types/tokens';
import useResponsive from 'hooks/useResponsive';
import { useMemo } from 'react';
import TraitsCard from 'components/TraitsCard';
import { TModalTheme } from 'components/CommonModal';

interface ITraitsListProps {
  data: ITrait[];
  theme?: TModalTheme;
  showNew?: boolean;
}

export default function TraitsList({ data = [], showNew = false, theme = 'light' }: ITraitsListProps) {
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
          <TraitsCard item={item} showNew={showNew} theme={theme} />
        </Col>
      ))}
    </Row>
  );
}
