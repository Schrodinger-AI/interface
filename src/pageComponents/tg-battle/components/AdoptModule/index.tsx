import { Flex } from 'antd';
import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import TGButton from 'components/TGButton';
import { useCmsInfo } from 'redux/hooks';
import { ReactComponent as VsSVG } from 'assets/img/telegram/battle/VS.svg';

type IProps = {
  onAdopt: (p: string) => void;
};

const DynamicBar = ({ onAdopt }: IProps) => {
  const cmsInfo = useCmsInfo();
  const prevSide = cmsInfo?.prevSide || '';
  const nextSide = cmsInfo?.nextSide || '';

  return (
    <Flex vertical className="mt-[16px]">
      <Flex className={clsx(styles['battle-contain'], 'relative')}>
        <Flex vertical align="center" className={clsx(styles['harris-contain'], 'basis-1/2')}>
          <div className={clsx(styles.harris, 'w-full h-[96vw] ')}></div>
        </Flex>
        <Flex vertical align="center" className={clsx(styles['trump-contain'], 'basis-1/2')}>
          <div className={clsx(styles.trump, 'w-full h-[96vw] ')}></div>
        </Flex>

        <img
          src={require('assets/img/telegram/battle/thunder.png').default.src}
          alt=""
          className="absolute top-0 left-1/2 -translate-x-1/2 w-auto h-full"
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <VsSVG className="w-[108px] h-[108px]" />
        </div>
      </Flex>

      <Flex className={'mt-[16px]'}>
        <Flex vertical align="center" className="basis-1/2">
          <TGButton size="large" onClick={() => onAdopt(nextSide)}>
            Adopt
          </TGButton>

          <p className="mt-[8px] px-[4px] text-xs font-medium text-pixelsWhiteBg text-center">
            If you choose Haris team,you are more likely to adopt cats with &quot;{nextSide}&quot; traits!
          </p>
        </Flex>
        <Flex vertical align="center" className="basis-1/2">
          <TGButton type="danger" size="large" onClick={() => onAdopt(prevSide)}>
            Adopt
          </TGButton>

          <p className="mt-[8px] px-[4px] text-xs font-medium text-pixelsWhiteBg text-center">
            If you choose Trump team,you are more likely to adopt cats with &quot;{prevSide}&quot; traits!
          </p>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DynamicBar;
