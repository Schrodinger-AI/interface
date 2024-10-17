'use client';

import { Flex } from 'antd';
import { ReactComponent as PoolSVG } from 'assets/img/telegram/battle/icon_pool.svg';
import { ReactComponent as QuestionSVG } from 'assets/img/telegram/battle/icon_question.svg';
import Link from 'next/link';

export default function HeaderModule() {
  return (
    <Flex align="start" justify="space-between" className="">
      <div>
        <p className="font-black text-[16px] leading-[24px] text-pixelsWhiteBg mb-[4px]">Which Type You Prefer?</p>
        <p className="font-semibold text-[12px] leading-[20px] text-pixelsWhiteBg">3 Days 14:23:45</p>
      </div>
      <Flex align="center" justify="center" gap={32}>
        <Link href="/assets">
          <PoolSVG className="w-[32px] h-[32px]" />
        </Link>
        <div className="">
          <QuestionSVG className="w-[32px] h-[32px]" />
        </div>
      </Flex>
    </Flex>
  );
}
