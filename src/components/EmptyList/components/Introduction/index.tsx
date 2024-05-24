import { Collapse } from 'aelf-design';
import React, { useState } from 'react';
import styles from './index.module.css';
import { TEmptyChannelIntroduction } from 'types/misc';
import clsx from 'clsx';
import { ReactComponent as ArrowDownIcon } from 'assets/img/arrow.svg';
import { Col, Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import StepCard from '../StepCard';
import IntroductionList from '../IntroductionList';

function Introduction({ title, step, list }: TEmptyChannelIntroduction) {
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
              <div>
                {step && step.length ? (
                  <Row gutter={[16, 16]} className="px-[8px] pb-[8px]">
                    {step.map((info, index) => {
                      return (
                        <Col span={isLG ? 24 : 12} key={index}>
                          <StepCard {...info} />
                        </Col>
                      );
                    })}
                  </Row>
                ) : null}
                {list && list.length ? (
                  <div className={clsx(step && step.length ? 'mt-[16px]' : '')}>
                    {list.map((info, index) => {
                      return <IntroductionList key={index} {...info} />;
                    })}
                  </div>
                ) : null}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

export default React.memo(Introduction);
