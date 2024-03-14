import { Flex } from 'antd';
import { BGCSVG, LeftSVG, ELFSVG, BGCMobile, LeftMobile, ELFMobile } from 'assets/img/home';
import useResponsive from 'hooks/useResponsive';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';
import styles from './style.module.css';
import { Button } from 'aelf-design';
import { ENVIRONMENT } from 'constants/url';

export default function TokensHome() {
  const { checkLogin } = useCheckLoginAndToken();
  const { isLG } = useResponsive();

  const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

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
          <div className="flex items-center justify-center">
            <span className="relative">
              <span className="text-center text-[48px] lg:text-[80px] font-bold">Schrödinger</span>
              {env === ENVIRONMENT.TEST && (
                <span className="absolute -top-[16px] lg:-top-[12px] right-0 lg:-right-[96px] flex text-[16px] lg:text-[24px] font-semibold justify-center items-center bg-brandDefault text-white rounded-[8px] lg:rounded-[12px] h-[24px] lg:h-[40px] w-[53px] lg:w-[80px] !rounded-bl-none">
                  TEST
                </span>
              )}
            </span>
          </div>
          <div className="text-base lg:text-2xl text-center">
            {`An AI-powered ACS-404 inscription allowing you to adopt cats and enjoy the fun of dynamic gameplay and
            unpredictable transformation. Evolving your cats to higher levels equips them with more randomly
            AI-generated traits. More traits, more rare, it's gacha-style fun!`}
          </div>
        </div>
        <Flex vertical align="center" gap={16}>
          <Button
            className="w-[206px] !rounded-lg"
            type="primary"
            size="large"
            onClick={() => {
              store.dispatch(setLoginTrigger('login'));
              checkLogin();
            }}>
            Connect Wallet
          </Button>
          <div className="max-w-[188px] lg:max-w-[334px] text-sm leading-[22px] text-[#919191] text-center">
            Log in to view your cats, or adopt new cats.
          </div>
        </Flex>
      </Flex>
      <div className="flex justify-end pr-[28px] lg:fixed lg:top-[540px] lg:right-[140px]">
        {isLG ? <ELFMobile /> : <ELFSVG />}
      </div>
    </div>
  );
}
