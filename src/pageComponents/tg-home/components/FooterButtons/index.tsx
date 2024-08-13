import { Button } from 'aelf-design';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import Link from 'next/link';

export default function FooterButtons({ cId }: { cId: string }) {
  const { isLogin } = useGetLoginStatus();

  return (
    <div className="w-full fixed bottom-0 left-0 h-[72px] px-[16px] bg-pixelsModalBg z-10 flex gap-[16px] justify-center items-center">
      <Link href={`/telegram/forest/trade?cId=${cId}`} className="flex-1">
        <Button size="medium" type="default" className="!w-full !default-button-dark">
          Trade
        </Button>
      </Link>
      <Link href={isLogin ? '/telegram?pageState=1' : ''} className="flex-1">
        <Button size="medium" type="default" className="!w-full !default-button-dark">
          My Cats
        </Button>
      </Link>
      <Link href={isLogin ? '/summary-points' : ''} className="flex-1">
        <Button size="medium" type="default" className="!w-full !default-button-dark">
          Points
        </Button>
      </Link>
    </div>
  );
}
