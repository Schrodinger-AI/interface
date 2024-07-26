/* eslint-disable @next/next/no-img-element */
import { Button } from 'aelf-design';
import { Flex } from 'antd';
import Link from 'next/link';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

export default function AdoptModule({ onAdopt, cId }: { onAdopt: () => void; cId: string }) {
  const { isLogin } = useGetLoginStatus();

  return (
    <Flex
      className="p-4 border-[2px] border-dashed border-pixelsPrimaryTextPurple bg-pixelsModalBg tg-card-shadow z-10 relative"
      vertical
      gap={16}>
      <img
        src={require('assets/img/telegram/adopt-text.png').default.src}
        alt=""
        className="w-[143px] h-9 object-contain"
      />
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
      <Flex gap={16}>
        <Link href={isLogin ? '/telegram?pageState=1' : ''} className="flex-1">
          <Button
            size="medium"
            className="!w-full !bg-pixelsPageBg !border-dashed !border-[1px] !border-pixelsPrimaryTextPurple !tg-card-shadow !rounded-none !text-pixelsWhiteBg !text-sm !font-medium">
            My Cats
          </Button>
        </Link>
        <Link href={`/telegram/forest/trade?cId=${cId}`} className="flex-1">
          <Button
            size="medium"
            type="primary"
            className="!w-full !primary-button-dark !text-pixelsWhiteBg !text-sm !font-medium">
            Trade
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
