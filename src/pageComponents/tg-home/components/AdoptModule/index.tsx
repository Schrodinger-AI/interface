/* eslint-disable @next/next/no-img-element */
import { Flex } from 'antd';
import Link from 'next/link';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import clsx from 'clsx';
import { ReactComponent as CatSVG } from 'assets/img/telegram/cat.svg';
import { useCmsInfo } from 'redux/hooks';

export default function AdoptModule({ onAdopt }: { onAdopt: () => void }) {
  const { tgHomePageText } = useCmsInfo() || {};

  return (
    <div className="relative">
      <Flex
        className="p-4 border-[2px] border-dashed border-pixelsPrimaryTextPurple bg-pixelsModalBg tg-card-shadow z-10 relative"
        vertical
        gap={16}>
        <CatSVG className="w-[70px] h-[60px] absolute left-[32px] -top-[38px]" />

        <div className="w-full flex justify-between items-center">
          <span className={clsx('dark-title text-2xl font-semibold')}>Adopt a cat</span>
          <Link href="/telegram/rules">
            <Flex gap={8} align="center" className="cursor-pointer w-fit text-neutralWhiteBg">
              Rule
              <QuestionSVG className="fill-pixelsWhiteBg" />
            </Flex>
          </Link>
        </div>

        <div className="text-sm text-pixelsTertiaryTextPurple">
          {tgHomePageText?.map((item, index) => {
            return typeof item === 'string' ? (
              <p key={index}>{item}</p>
            ) : (
              <div key={index}>
                {item.map((text, i) => {
                  return <p key={'' + index + i}>{text}</p>;
                })}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_item, index) => {
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
      <img
        src={require('assets/img/telegram/ball-1.png').default.src}
        alt=""
        className="w-[72px] h-[96px] absolute -left-4 top-[99px] z-0"
      />
      <img
        src={require('assets/img/telegram/cloud.png').default.src}
        alt=""
        className="w-[217.6px] h-10 absolute -right-4 -top-[37px]"
      />
    </div>
  );
}
