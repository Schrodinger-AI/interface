import React, { useMemo } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/icon_arrow.svg';

type TgCollapseProps = {
  items: CollapseProps['items'];
};

const TgCollapse: React.FC<TgCollapseProps> = (props) => {
  const { items } = props;

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: 'red',
    border: 'none',
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(
    () =>
      items?.map((item, index) => ({
        ...item,
        style: { ...panelStyle },
        className:
          index % 2 === 0 ? 'bg-compareRightBg shadow-compareRightShadow' : 'bg-compareLeftBg shadow-compareLeftShadow',
      })),
    [items],
  );

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIconPosition="end"
      ghost={true}
      expandIcon={({ isActive }) => <ArrowSVG className={isActive ? 'rotate-180' : ''} />}
      items={data}
    />
  );
};

export default TgCollapse;
