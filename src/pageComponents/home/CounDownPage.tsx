import { Button } from 'aelf-design';
import CountDownModule from './components/CountDownModule';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import SocialMedia, { SocialMediaItem } from './components/SocialMedia';
import { useState } from 'react';
import useCheckJoinStatus from './hooks/useCheckJoinStatus';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';

export type TriggerType = 'login' | 'join';

export default function CountDownPage() {
  const { checkLogin, isOK } = useCheckLoginAndToken();
  const { isLogin, wallet } = useWalletService();

  const { cmsInfo } = useGetStoreInfo();

  const [trigger, setTrigger] = useState<TriggerType>('login');

  const { isJoin, pollingRequestSync } = useCheckJoinStatus({
    trigger,
  });

  const handleJoinUs = async () => {
    setTrigger('join');
    if (isLogin) {
      await pollingRequestSync();
    } else {
      checkLogin();
    }
  };

  const socialMediaList: SocialMediaItem[] = [
    {
      index: 1,
      icon: '',
      link: 'https://twitter.com/ProjSchrodinger',
      target: '',
      name: 'twitter',
    },
    {
      index: 2,
      icon: '',
      link: 'https://discord.com/invite/P8SuN7mzth',
      target: '',
      name: 'discord',
    },
    // {
    //   index: 3,
    //   icon: '',
    //   link: '',
    //   target: '',
    //   name: 'gitbook',
    // },
    {
      index: 4,
      icon: '',
      link: 'https://t.me/projectschrodingercat',
      target: '',
      name: 'telegram',
    },
    {
      index: 5,
      icon: '',
      link: 'https://linktr.ee/projectschrodinger',
      target: '',
      name: 'linktree',
    },
  ];

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
        <CountDownModule targetDate={cmsInfo?.openTimeStamp || ''} />
      </section>
      <section className="mt-[64px] md:mt-[100px] mx-auto w-full">
        {isOK && isJoin ? (
          <div className="text-[#434343] text-[16px] leading-[24px] font-medium text-center">
            You are enrolled, please wait for CAT coming!
          </div>
        ) : (
          <Button
            type="primary"
            size="ultra"
            className="w-full mx-auto max-w-[356px] md:!w-[356px]  !rounded-xl"
            onClick={handleJoinUs}>
            Join Us Now
          </Button>
        )}
      </section>
      {socialMediaList?.length && (
        <section className="mt-[32px] md:mt-[40px]">
          <SocialMedia data={socialMediaList} />
        </section>
      )}
    </section>
  );
}
