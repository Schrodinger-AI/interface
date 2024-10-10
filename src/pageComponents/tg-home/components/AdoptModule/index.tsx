/* eslint-disable @next/next/no-img-element */
import { Flex } from 'antd';
import Link from 'next/link';
import TGButton from 'components/TGButton';
import { ReactComponent as BagSVG } from 'assets/img/telegram/icon-bags.svg';
import { ReactComponent as WheelSVG } from 'assets/img/telegram/icon-wheel.svg';
import { ReactComponent as ShoppingSVG } from 'assets/img/telegram/icon-shopping.svg';
import { ReactComponent as PoolsSVG } from 'assets/img/telegram/icon-pools.svg';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
// import { useCmsInfo } from 'redux/hooks';

export default function AdoptModule({ onAdopt }: { onAdopt: () => void }) {
  // const { tgHomePageText } = useCmsInfo() || {};
  const { isLogin } = useGetLoginStatus();

  return (
    <div className="relative">
      <Flex className="p-4 z-10 relative" align="center" vertical>
        <img src={require('assets/img/telegram/cat.png').default.src} alt="" className="w-[26.6vw] z-10" />

        <div className="mt-[-5px]">
          {Array.from({ length: 1 }).map((_item, index) => {
            return (
              <Flex vertical justify="center" align="center" key={index}>
                <img
                  key={index}
                  src={require('assets/img/telegram/adopt-card.png').default.src}
                  alt=""
                  className="w-[40vw]"
                />

                <TGButton type="success" size="large" className="mt-4" onClick={onAdopt}>
                  Adopt
                </TGButton>
              </Flex>
            );
          })}
        </div>

        <img src={require('assets/img/telegram/cat2.png').default.src} alt="" className="mt-4 w-[50.7vw] z-10" />
      </Flex>

      <Link href={isLogin ? '/tg-referral' : ''} className="absolute top-[37px] left-0 ">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[19.2vw] h-[19.2vw] bg-[var(--fill-mask-7)] rounded-[8px]">
          <BagSVG className="w-[32px] h-[32px]" />
          <div className="dark-btn-font leading-[18px]">My Bags</div>
        </Flex>
      </Link>
      <Link href={isLogin ? '/tg-referral' : ''} className="absolute top-[37px] right-0">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[19.2vw] h-[19.2vw] bg-[var(--fill-mask-7)] rounded-[8px]">
          <WheelSVG className="w-[32px] h-[32px]" />
          <div className="dark-btn-font leading-[18px]">Lucky Spin</div>
        </Flex>
      </Link>
      <Link href={isLogin ? '/tg-referral' : ''} className="absolute top-[40vw] left-0">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[19.2vw] h-[19.2vw] bg-[var(--fill-mask-7)] rounded-[8px]">
          <ShoppingSVG className="w-[32px] h-[32px]" />
          <div className="dark-btn-font leading-[18px]">Shopping</div>
        </Flex>
      </Link>
      <Link href={isLogin ? '/tg-referral' : ''} className="absolute top-[40vw] right-0">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[19.2vw] h-[19.2vw] bg-[var(--fill-mask-7)] rounded-[8px]">
          <PoolsSVG className="w-[32px] h-[32px]" />
          <div className="dark-btn-font leading-[18px]">Pools</div>
        </Flex>
      </Link>
    </div>
  );
}
