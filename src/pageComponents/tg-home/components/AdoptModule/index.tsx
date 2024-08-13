/* eslint-disable @next/next/no-img-element */
import { Flex } from 'antd';
import Link from 'next/link';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import clsx from 'clsx';

export default function AdoptModule({ onAdopt }: { onAdopt: () => void }) {
  return (
    <Flex
      className="p-4 border-[2px] border-dashed border-pixelsPrimaryTextPurple bg-pixelsModalBg tg-card-shadow z-10 relative"
      vertical
      gap={16}>
      <div className="w-full flex justify-between items-center">
        <span className={clsx('dark-title text-2xl font-semibold')}>Adopt a cat</span>
        <Link href="/telegram/rules">
          <Flex gap={8} align="center" className="cursor-pointer w-fit text-neutralWhiteBg">
            Rule
            <QuestionSVG className="fill-pixelsWhiteBg" />
          </Flex>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((item, index) => {
          return (
            <img
              onClick={onAdopt}
              key={index}
              src={require('assets/img/telegram/adopt-card.png').default.src}
              alt=""
              className="cursor-pointer"
            />
          );
        })}
      </div>
    </Flex>
  );
}
