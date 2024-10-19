'use client';

import { Flex } from 'antd';
import { ReactComponent as PoolSVG } from 'assets/img/telegram/battle/icon_pool.svg';
import { ReactComponent as QuestionSVG } from 'assets/img/telegram/battle/icon_question.svg';
import Countdown from 'antd/es/statistic/Countdown';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './index.module.css';

type Props = {
  countdown: number;
  showRules: () => void;
  onFinish?: () => void;
};

export default function HeaderModule({ countdown, showRules, onFinish }: Props) {
  const deadline = useMemo(() => {
    return Date.now() + countdown * 1000;
  }, [countdown]);

  const format = useMemo(
    () =>
      countdown > 60 * 60 * 24 * 2 ? 'D [Days] HH:mm:ss' : countdown > 60 * 60 * 24 ? 'D [Day] HH:mm:ss' : 'HH:mm:ss',
    [countdown],
  );

  return (
    <Flex align="start" justify="space-between" className="">
      <div>
        <p className="font-black text-[16px] leading-[24px] text-pixelsWhiteBg mb-[4px]">Which Type You Prefer?</p>
        <p className="font-semibold text-[12px] leading-[20px] text-pixelsWhiteBg">
          <Countdown className={styles.countdown} value={deadline} format={format} onFinish={() => onFinish?.()} />
        </p>
      </div>
      <Flex align="center" justify="center" gap={32}>
        <Link href="/telegram/pool">
          <PoolSVG className="w-[32px] h-[32px]" />
        </Link>
        <div onClick={showRules}>
          <QuestionSVG className="w-[32px] h-[32px]" />
        </div>
      </Flex>
    </Flex>
  );
}
