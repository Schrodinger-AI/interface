import { Button } from 'aelf-design';
import CountDownModule from './components/CountDownModule';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { store } from 'redux/store';
import { cmsInfo } from '../../../mock';
import Image from 'next/image';
import { useResponsive } from 'ahooks';
import SocialMedia from './components/SocialMedia';
import useLoading from 'hooks/useLoading';
import { cloneElement, useEffect, useState } from 'react';
import useCheckJoinStatus from './hooks/useCheckJoinStatus';

export type TriggerType = 'login' | 'join';

export default function CountDownPage() {
  const { checkLogin, isOK } = useCheckLoginAndToken();
  const { isLogin } = useWalletService();

  //TODO:
  const { openTimeStamp } = cmsInfo;

  const [trigger, setTrigger] = useState<TriggerType>('login');

  useCheckJoinStatus({
    trigger,
  });

  const responsive = useResponsive();

  const { showLoading, closeLoading } = useLoading();

  const handleJoinUs = () => {
    if (isOK) {
    } else {
      checkLogin();
    }
  };
  return (
    <section className="py-[64px] md:py-[80px] flex flex-col items-center w-full">
      <img
        src={require('assets/img/schrodinger.png').default.src}
        alt="schrodinger"
        className="rounded-lg md:rounded-xl w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
      />
      <h1 className="mt-[24px] md:mt-[40px] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#1A1A1A] text-center">
        The first aelf Al Inscriptions 404 coming soon...
      </h1>
      <section className="mt-[24px] md:mt-[40px]">
        <CountDownModule targetDate={openTimeStamp} />
      </section>
      <section className="mt-[64px] md:mt-[100px] mx-auto w-full">
        {!isLogin ? (
          <Button
            type="primary"
            size="ultra"
            className="w-full mx-auto max-w-[356px] md:!w-[356px]  !rounded-xl"
            onClick={handleJoinUs}
          >
            Join Us Now
          </Button>
        ) : (
          <div className="text-[#434343] text-[16px] leading-[24px] font-medium text-center">
            You are enrolled, please wait for CAT coming!
          </div>
        )}
      </section>
      {cmsInfo.socialMediaList?.length && (
        <section className="mt-[32px] md:mt-[40px]">
          <SocialMedia data={cmsInfo.socialMediaList} />
        </section>
      )}
    </section>
  );
}
