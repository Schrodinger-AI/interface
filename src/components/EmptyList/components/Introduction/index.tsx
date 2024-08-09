import { Collapse } from 'aelf-design';
import React, { useMemo, useState } from 'react';
import styles from './index.module.css';
import { TEmptyChannelIntroduction } from 'types/misc';
import clsx from 'clsx';
import { ReactComponent as ArrowDownIcon } from 'assets/img/arrow.svg';
import { Col, Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import StepCard from '../StepCard';
import IntroductionList from '../IntroductionList';
import { TModalTheme } from 'components/CommonModal';

function Introduction({
  title,
  step,
  list,
  theme = 'light',
}: TEmptyChannelIntroduction & {
  theme?: TModalTheme;
}) {
  const [rotate, setRotate] = useState<boolean>(false);
  const { isLG } = useResponsive();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  return (
    <div className={clsx(styles['empty-introduction'], isDark && styles['empty-introduction-dark'])}>
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
              <span
                className={clsx(
                  'text-xs font-medium flex items-center',
                  isDark ? 'text-pixelsPrimaryTextPurple' : 'text-brandDefault',
                )}>
                {title}
                <ArrowDownIcon
                  className={clsx(
                    'w-[12px] h-[12px] ml-[8px]',
                    rotate ? 'rotate-180' : '',
                    isDark ? 'fill-pixelsPrimaryTextPurple' : 'fill-brandDefault',
                  )}
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
                      return <IntroductionList key={index} {...info} theme={theme} />;
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
