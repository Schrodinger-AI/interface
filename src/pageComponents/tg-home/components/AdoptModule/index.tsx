/* eslint-disable @next/next/no-img-element */
import { Flex } from 'antd';
import Link from 'next/link';
import TGButton from 'components/TGButton';
import { ReactComponent as BagSVG } from 'assets/img/telegram/icon-bags.svg';
import { ReactComponent as WheelSVG } from 'assets/img/telegram/icon-wheel.svg';
import { ReactComponent as ShoppingSVG } from 'assets/img/telegram/icon-shopping.svg';
import { ReactComponent as PoolsSVG } from 'assets/img/telegram/icon-pools.svg';
import { ReactComponent as MyBagsTextSVG } from 'assets/img/telegram/home-list/my-bags.svg';
import { ReactComponent as PoolsTextSVG } from 'assets/img/telegram/home-list/pools.svg';
import { ReactComponent as LuckySpinTextSVG } from 'assets/img/telegram/home-list/lucky-spin.svg';
import { ReactComponent as ShoppingTextSVG } from 'assets/img/telegram/home-list/shopping.svg';
import adoptButtonIcon from 'assets/img/telegram/home-list/adopt-button.png';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useState } from 'react';
import TgModal from 'components/TgModal';
import clsx from 'clsx';
// import { useCmsInfo } from 'redux/hooks';
import styles from './index.module.css';
import Image from 'next/image';

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
  const { isLogin } = useGetLoginStatus();
  const [isOpen, setIsOpen] = useState(false);

  const handleShow = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <Flex className="py-[16px] px-4 z-10 relative" align="center" vertical>
        {isInActivity ? (
          <img src={require('assets/img/telegram/cat-activity.png').default.src} alt="" className="w-[26.6vw] z-10" />
        ) : (
          <img src={require('assets/img/telegram/cat.png').default.src} alt="" className="w-[26.6vw] z-10" />
        )}

        <div className="mt-[-5px]">
          <Flex vertical justify="center" align="center">
            <img src={require('assets/img/telegram/adopt-card.png').default.src} alt="" className="w-[40vw]" />

            <TGButton type="success" size="large" className="mt-4" onClick={onAdopt}>
              <Image src={adoptButtonIcon} className="w-auto h-[24px]" alt="adopt" />
            </TGButton>
          </Flex>
        </div>
        {!isInActivity && (
          <img src={require('assets/img/telegram/cat2.png').default.src} alt="" className="mt-4 w-[50.7vw] z-10" />
        )}
      </Flex>

      <Link href={isLogin ? '/telegram?pageState=1' : ''} className="absolute top-[37px] left-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[19.2vw] h-[19.2vw] bg-[var(--fill-mask-7)] rounded-[8px]">
          <BagSVG className="w-[32px] h-[32px]" />
          <MyBagsTextSVG className="mt-[4px]" />
        </Flex>
      </Link>
      <div onClick={handleShow} className="absolute top-[37px] right-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[19.2vw] h-[19.2vw] bg-[var(--fill-mask-7)] rounded-[8px]">
          <WheelSVG className="w-[32px] h-[32px]" />
          <LuckySpinTextSVG className="mt-[4px]" />
        </Flex>
      </div>
      <Link href={cId ? `/telegram/forest/trade?cId=${cId}` : ''} className="absolute top-[40vw] left-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[19.2vw] h-[19.2vw] bg-[var(--fill-mask-7)] rounded-[8px]">
          <ShoppingSVG className="w-[32px] h-[32px]" />
          <ShoppingTextSVG className="mt-[4px]" />
        </Flex>
      </Link>
      <div onClick={handleShow} className="absolute top-[40vw] right-0 z-20">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-[19.2vw] h-[19.2vw] bg-[var(--fill-mask-7)] rounded-[8px]">
          <PoolsSVG className="w-[32px] h-[32px]" />
          <PoolsTextSVG className="mt-[4px]" />
        </Flex>
      </div>

      <TgModal
        title="Coming Soon"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <Flex vertical justify="center" align="center" className="h-[184px]" gap={16}>
          <img src={require('assets/img/telegram/lock.png').default.src} alt="" className="w-[72px] h-[72px]" />
          <button
            className={clsx(styles['modal-button'], '!w-[124px] !h-[48px]')}
            onClick={() => setIsOpen(false)}></button>
        </Flex>
      </TgModal>
    </div>
  );
}
