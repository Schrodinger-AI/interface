/* eslint-disable @next/next/no-img-element */
import { Flex } from 'antd';
import { ReactComponent as ExpendSVG } from 'assets/img/telegram/expend.svg';
import { ReactComponent as CatSVG } from 'assets/img/telegram/cat.svg';
import { useCallback } from 'react';

export default function IntroText() {
  const handleCommunity = useCallback(() => {
    //TODO:
  }, []);

  return (
    <div className="relative">
      <Flex
        className="p-4 border-[2px] border-dashed border-pixelsPrimaryTextPurple bg-pixelsModalBg text-xs text-pixelsTertiaryTextPurple font-normal relative z-10 tg-card-shadow"
        vertical
        gap={8}>
        <CatSVG className="w-[70px] h-[60px] absolute left-[34px] -top-9" />
        <img
          src={require('assets/img/telegram/lucky-text.png').default.src}
          alt=""
          className="w-[104px] h-9 object-contain"
        />
        <p>Welcome to the mysterious Schrodinger Blind box, the rules of the game:</p>
        <div>
          <p>1. Open the blind box and draw out the rare cat with luck;</p>
          <p>2. Each time you open the blind box, it will cost 1.82 $SGR;</p>
          <p>3. After obtaining a rare cat, you can Trade it out in the trade and get a high profit;</p>
          <p>4. Users who join the community will increase the probability of drawing a rare cat!</p>
        </div>
        <Flex align="center" gap={4} className="cursor-pointer w-fit" onClick={handleCommunity}>
          <span className="text-pixelsPrimaryTextPink">Community</span>
          <ExpendSVG className="w-[14px] h-[14px] leading-[14px]" />
        </Flex>
      </Flex>
      <img
        src={require('assets/img/telegram/ball-1.png').default.src}
        alt=""
        className="w-[72px] h-[96px] absolute -left-4 -bottom-[99px] z-0"
      />
      <img
        src={require('assets/img/telegram/ball-2.png').default.src}
        alt=""
        className="w-[62.2px] h-16 absolute  -right-4 -bottom-[37px] z-0"
      />
      <img
        src={require('assets/img/telegram/cloud.png').default.src}
        alt=""
        className="w-[217.6px] h-10 absolute -right-4 -top-[37px]"
      />
    </div>
  );
}
