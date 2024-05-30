/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { HandleCardType, IActivityDetailHandle } from 'redux/types/reducerTypes';
import { useResponsive } from 'hooks/useResponsive';
import BindEvm from './BindEvm';
import { Col, Row } from 'antd';
import clsx from 'clsx';

function HandleCard({ handleCardList }: { handleCardList: IActivityDetailHandle[] }) {
  const { isXL } = useResponsive();

  const getHandleComponent = (type: HandleCardType) => {
    switch (type) {
      case HandleCardType.BindEVM:
        return <BindEvm />;
      default:
        return null;
    }
  };

  if (!handleCardList || !handleCardList.length) return null;

  return (
    <Row gutter={[24, isXL ? 12 : 16]} className="mt-[12px]">
      {handleCardList.map((item, index) => {
        return (
          <Col
            span={isXL ? 24 : 12}
            key={index}
            className={clsx('flex items-center last:mb-[4px]', isXL ? 'flex-col' : 'flex-row')}>
            <div
              className={clsx(
                'shadow-cardShadow py-[16px] flex-1 px-[16px] lg:px-[24px] rounded-lg flex items-center h-[96px] lg:h-[120px] w-full lg:w-auto ',
              )}>
              {getHandleComponent(item.type)}
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

export default React.memo(HandleCard);
