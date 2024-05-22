import { Collapse } from 'aelf-design';
import React, { useState } from 'react';
import styles from './index.module.css';
import { TEmptyChannelIntroduction, TEmptyChannelIntroductionStep } from 'types/misc';
import clsx from 'clsx';
import { ReactComponent as ArrowDownIcon } from 'assets/img/arrow.svg';
import { Col, Row } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import { useResponsive } from 'hooks/useResponsive';

function StepCard({ title, description, card }: TEmptyChannelIntroductionStep) {
  return (
    <div>
      <p className="text-sm text-neutralPrimary font-medium">{title}</p>
      {description ? (
        <div className="h-auto lg:h-[40px]">
          {description.map((item, index) => {
            return (
              <span key={index} className="text-neutralSecondary text-xs">
                {item}
              </span>
            );
          })}
        </div>
      ) : null}
      {card && card.image ? (
        <div className="mt-[8px] shadow-cardShadow p-[12px] rounded-lg max-h-[120px]">
          <SkeletonImage
            img={card.image}
            className="w-full max-h-[120px] !rounded-none"
            imageClassName="!rounded-none"
          />
        </div>
      ) : null}
    </div>
  );
}

function Introduction({ title, step }: TEmptyChannelIntroduction) {
  const [rotate, setRotate] = useState<boolean>(false);
  const { isLG } = useResponsive();

  return (
    <div className={clsx(styles['empty-introduction'])}>
      <Collapse
        ghost
        onChange={(open) => {
          if (open.length) {
            setRotate(true);
          } else {
            setRotate(false);
          }
        }}
        items={[
          {
            key: title,
            label: (
              <span className="text-brandDefault text-xs font-medium flex items-center">
                {title}
                <ArrowDownIcon
                  className={clsx('fill-brandDefault w-[12px] h-[12px] ml-[8px]', rotate ? 'rotate-180' : '')}
                />
              </span>
            ),
            children: (
              <Row gutter={[16, 16]} className="px-[8px] pb-[8px]">
                {step.map((info, index) => {
                  return (
                    <Col span={isLG ? 24 : 12} key={index}>
                      <StepCard {...info} />
                    </Col>
                  );
                })}
              </Row>
            ),
          },
        ]}></Collapse>
    </div>
  );
}

export default React.memo(Introduction);
