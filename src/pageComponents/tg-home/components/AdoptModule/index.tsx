/* eslint-disable @next/next/no-img-element */
import { Button } from 'aelf-design';
import { Flex } from 'antd';
import Link from 'next/link';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

export default function AdoptModule({ onAdopt }: { onAdopt: () => void }) {
  const { isLogin } = useGetLoginStatus();

  return (
    <Flex
      className="p-4 border-[2px] border-dashed border-pixelsPrimaryTextPurple bg-pixelsModalBg tg-card-shadow z-10 relative"
      vertical
      gap={16}>
      <Flex align="center" justify="space-between">
        <img
          src={require('assets/img/telegram/adopt-text.png').default.src}
          alt=""
          className="w-[143px] h-9 object-contain"
        />
        <Link href={isLogin ? '/telegram?pageState=1' : ''}>
          <Button size="small" className="!primary-button-dark !px-2 !text-pixelsWhiteBg !text-xs !font-medium">
            My Cats
          </Button>
        </Link>
      </Flex>
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
