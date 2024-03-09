import { Flex, Button } from 'antd';
import { BGCSVG, LeftSVG, ELFSVG, BGCMobile, LeftMobile, ELFMobile } from 'assets/img/home';
import { useResponsive } from 'ahooks';
import styles from './style.module.css';

export default function Home() {
  const responsive = useResponsive();
  console.log('responsive', responsive);
  return (
    <div className="pt-[24px]">
      <div className="md:fixed md:top-[200px] md:left-[36px]">{responsive.md ? <LeftSVG /> : <LeftMobile />}</div>
      <div className={styles.bgCenter}>{responsive.md ? <BGCSVG /> : <BGCMobile />}</div>
      <Flex
        vertical
        align="center"
        justify="center"
        className="gap-[32px] md:gap-[48px] md:w-[910px] mx-auto md:pt-[208px]">
        <div className="flex flex-col align-center justify-center md:gap-[24px] gap-[16px]">
          <div className="text-center text-[48px] md:text-[80px] font-bold">Schrödinger</div>
          <div className="text-base md:text-2xl text-center">Log in to view your assets or mint inscriptions.</div>
        </div>
        <Flex vertical align="center" gap={16}>
          <Button className="w-[206px] h-[48px] px-[28px] py-[12px] rounded-lg" type="primary">
            Connect Wallet
          </Button>
          <div className="max-w-[188px] md:max-w-[334px] text-sm leading-[22px] text-[#919191] text-center">
            Wallet not connected yet. Link the wallet, view assets, and mint inscription.
          </div>
        </Flex>
      </Flex>
      <div className="flex justify-end pr-[28px] md:fixed md:top-[540px] md:right-[140px]">
        {responsive.md ? <ELFSVG /> : <ELFMobile />}
      </div>
    </div>
  );
}
