import { Flex, Button } from 'antd';
import { BGCSVG, LeftSVG, ELFSVG, BGCMobile, LeftMobile, ELFMobile } from 'assets/img/home';
import useResponsive from 'hooks/useResponsive';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';
import styles from './style.module.css';
import { useState } from 'react';
import SyncAdoptModal from 'components/SyncAdoptModal';

export default function Home() {
  const { checkLogin } = useCheckLoginAndToken();
  const { isLG } = useResponsive();
  const [open, setOpen] = useState(false);
  return (
    <div className="pt-[24px]">
      <div className="lg:fixed lg:top-[200px] lg:left-[36px]">{isLG ? <LeftMobile /> : <LeftSVG />}</div>
      <div className={isLG ? styles.bgCenterMobile : styles.bgCenter}>
        {isLG ? <BGCMobile className="w-[660px] h-[480px]" /> : <BGCSVG />}
      </div>
      <Flex
        vertical
        align="center"
        justify="center"
        className="gap-[32px] lg:gap-[48px] lg:w-[910px] mx-auto lg:pt-[208px]">
        <div className="flex flex-col align-center justify-center lg:gap-[24px] gap-[16px]">
          <div className="text-center text-[48px] lg:text-[80px] font-bold">Schrödinger</div>
          <div className="text-base lg:text-2xl text-center">Log in to view your assets or mint inscriptions.</div>
        </div>
        <Flex vertical align="center" gap={16}>
          <Button
            className="w-[206px] h-[48px] px-[28px] py-[12px] rounded-lg text-base font-medium"
            type="primary"
            onClick={() => {
              store.dispatch(setLoginTrigger('login'));
              checkLogin();
            }}>
            Connect Wallet
          </Button>
          <div className="max-w-[188px] lg:max-w-[334px] text-sm leading-[22px] text-[#919191] text-center">
            Wallet not connected yet. Link the wallet, view assets, and mint inscription.
          </div>
          <Button onClick={() => setOpen(true)}>progress</Button>
        </Flex>
      </Flex>
      <div className="flex justify-end pr-[28px] lg:fixed lg:top-[540px] lg:right-[140px]">
        {isLG ? <ELFMobile /> : <ELFSVG />}
      </div>
      <SyncAdoptModal open={open} />
    </div>
  );
}
