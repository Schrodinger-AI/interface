import { Flex } from 'antd';
import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import TGButton from 'components/TGButton';

type IProps = {
  onAdopt: (p: string) => void;
};

const DynamicBar = ({ onAdopt }: IProps) => {
  return (
    <Flex gap={'15px'} className="mt-[16px]">
      <Flex vertical align="center" className="basis-1/2">
        <div className={clsx(styles.haris, 'w-full h-[96vw] ')}></div>

        <TGButton size="large" className="mt-[24px]" onClick={() => onAdopt('2')}>
          Adopt
        </TGButton>

        <p className="mt-[4px] px[4px] text-[10px] leading-[18px] font-medium text-pixelsWhiteBg text-center">
          If you choose Haris team,you are more likely to adopt cats with &quot;Haris&quot; traits!
        </p>
      </Flex>
      <Flex vertical align="center" className="basis-1/2">
        <div className={clsx(styles.trump, 'w-full h-[96vw] ')}></div>

        <TGButton type="danger" size="large" className="mt-[24px]" onClick={() => onAdopt('1')}>
          Adopt
        </TGButton>

        <p className="mt-[4px] px[4px] text-[10px] leading-[18px] font-medium text-pixelsWhiteBg text-center">
          If you choose Trump team,you are more likely to adopt cats with &quot;Trump&quot; traits!
        </p>
      </Flex>
    </Flex>
  );
};

export default DynamicBar;
