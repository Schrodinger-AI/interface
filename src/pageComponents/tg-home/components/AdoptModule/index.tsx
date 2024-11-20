/* eslint-disable @next/next/no-img-element */
import { Flex } from 'antd';
import Lottie from 'lottie-web';
import TGButton from 'components/TGButton';
import { ReactComponent as BagSVG } from 'assets/img/telegram/icon-bags.svg';
import { ReactComponent as WheelSVG } from 'assets/img/telegram/icon-wheel.svg';
import { ReactComponent as ShoppingSVG } from 'assets/img/telegram/icon-shopping.svg';
import { ReactComponent as PoolsSVG } from 'assets/img/telegram/icon-pools.svg';
import { ReactComponent as MyBagsTextSVG } from 'assets/img/telegram/home-list/my-bags.svg';
import { ReactComponent as PoolsTextSVG } from 'assets/img/telegram/home-list/pools.svg';
import { ReactComponent as LuckySpinTextSVG } from 'assets/img/telegram/home-list/lucky-spin.svg';
import { ReactComponent as ShoppingTextSVG } from 'assets/img/telegram/home-list/shopping.svg';
import { ReactComponent as CatPowSVG } from 'assets/img/telegram/icon-cat-paw.svg';
import { ReactComponent as MergeTextSVG } from 'assets/img/telegram/home-list/merge.svg';
import { ReactComponent as BoxLeftSVG } from 'assets/img/telegram/box-left.svg';
import { ReactComponent as BoxRightSVG } from 'assets/img/telegram/box-right.svg';
import adoptButtonIcon from 'assets/img/telegram/home-list/adopt-button.png';
import HomeTreasure from 'assets/animations/homepage_treasure_box.json';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';
import { useEffect } from 'react';
import { useModal } from '@ebay/nice-modal-react';
import SyncingOnChainLoading from 'components/SyncingOnChainLoading';

export default function AdoptModule({
  cId,
  isInActivity,
  onAdopt,
}: {
  onAdopt: () => void;
  cId: string;
  isInActivity?: boolean;
}) {
  // const { tgHomePageText } = useCmsInfo() || {};
  const cmsInfo = useCmsInfo();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();
  const syncingOnChainLoading = useModal(SyncingOnChainLoading);

  useEffect(() => {
    Lottie.loadAnimation({
      container: document.getElementById('treasure-lottie') as Element,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: HomeTreasure,
    });
  }, []);

  const onHandleClick = (href: string) => {
    if (isLogin) {
      router.push(href);
    } else {
      syncingOnChainLoading.show({
        checkLogin: true,
      });
    }
  };

  return (
    <div className="relative z-[60] -mt-[40px]">
      <Flex className="py-[16px] px-4 z-10 relative" align="center" vertical>
        <div className="relative w-full flex justify-center items-center">
          {/* {!isInActivity ? (
            <Image
              src={lightRound}
              alt=""
              className="absolute w-full scale-110 aspect-square top-0 bottom-0 left-0 right-0 m-auto z-1"
            />
          ) : null} */}

          {isInActivity ? (
            <img src={require('assets/img/telegram/cat-activity.png').default.src} alt="" className="w-[26.6vw] z-10" />
          ) : cmsInfo?.homeTopCat ? (
            <img src={cmsInfo?.homeTopCat} alt="" className="w-auto h-[60px] z-10" />
          ) : (
            <img src={require('assets/img/telegram/cat.png').default.src} alt="" className="w-auto h-[60px] z-10" />
          )}
        </div>

        <div className="-mt-[5px] relative z-10">
          <Flex vertical justify="center" align="center">
            <img src={require('assets/img/telegram/adopt-card.png').default.src} alt="" className="w-[40vw]" />

            <TGButton size="large" className="mt-4 w-[150px]" onClick={onAdopt}>
              <Image src={adoptButtonIcon} className="w-auto h-[24px]" alt="adopt" />
            </TGButton>
          </Flex>
        </div>
        <div className="relative mt-[-22px] z-9">
          <div id="treasure-lottie" className="w-[35.47vw] h-[35.47vw] z-10 overflow-hidden"></div>
          <BoxLeftSVG className="absolute bottom-[20%] right-[100%] z-1" />
          <BoxRightSVG className="absolute bottom-[20%] left-[100%] z-1" />
        </div>
      </Flex>

      <div onClick={() => onHandleClick('/telegram?pageState=1')} className="absolute top-[70px] left-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[72px] h-[72px] bg-[var(--fill-mask-7)] rounded-[8px]">
          <BagSVG className="w-[32px] h-[32px]" />
          <MyBagsTextSVG className="mt-[4px]" />
        </Flex>
      </div>
      <div onClick={() => onHandleClick('/telegram/lucky-spin')} className="absolute top-[70px] right-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[72px] h-[72px] bg-[var(--fill-mask-7)] rounded-[8px]">
          <WheelSVG className="w-[32px] h-[32px]" />
          <LuckySpinTextSVG className="mt-[4px]" />
        </Flex>
      </div>
      <div
        onClick={() => onHandleClick(cId ? `/telegram/forest/trade?cId=${cId}` : '')}
        className="absolute top-[172px] left-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[72px] h-[72px] bg-[var(--fill-mask-7)] rounded-[8px]">
          <ShoppingSVG className="w-[32px] h-[32px]" />
          <ShoppingTextSVG className="mt-[4px]" />
        </Flex>
      </div>
      <div onClick={() => onHandleClick('/telegram/spin-pool')} className="absolute top-[172px] right-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[72px] h-[72px] bg-[var(--fill-mask-7)] rounded-[8px]">
          <PoolsSVG className="w-[32px] h-[32px]" />
          <PoolsTextSVG className="mt-[4px]" />
        </Flex>
      </div>
      <div onClick={() => onHandleClick('/telegram/breed')} className="absolute top-[274px] left-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[72px] h-[72px] bg-[var(--fill-mask-7)] rounded-[8px]">
          <CatPowSVG className="w-[32px] h-[32px]" />
          <MergeTextSVG className="mt-[4px]" />
        </Flex>
      </div>
    </div>
  );
}
