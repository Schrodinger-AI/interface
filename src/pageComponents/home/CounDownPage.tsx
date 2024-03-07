import { Button } from 'aelf-design';
import CountDownModule from './components/CountDownModule';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import SocialMedia, { SocialMediaItem } from './components/SocialMedia';
import { useState } from 'react';
import useCheckJoinStatus from './hooks/useCheckJoinStatus';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';

export default function CountDownPage() {
  const { checkLogin, isOK } = useCheckLoginAndToken();

  const { isLogin, wallet } = useWalletService();

  const { cmsInfo } = useGetStoreInfo();

  const { isJoin, pollingRequestSync } = useCheckJoinStatus();

  const handleJoinUs = async () => {
    store.dispatch(setLoginTrigger('join'));
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
        alt="Schrödinger"
        className="rounded-lg md:rounded-xl w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
      />
      <h1 className="mt-[24px] md:mt-[40px] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#1A1A1A] text-center">
        Generate AI-Powered ERC-404 Inscriptions
        <br />
        First Inscription Coming Soon
      </h1>
      <section className="mt-[24px] md:mt-[40px]">
        <CountDownModule targetDate={cmsInfo?.openTimeStamp || ''} />
      </section>
      <section className="mt-[64px] md:mt-[100px] mx-auto w-full">
        {isLogin && isJoin ? (
          <div className="text-[#434343] text-[16px] leading-[24px] font-medium text-center">
            {`Congratulations! You're successfully enrolled. Stay tuned for more details on how to own your cat.. meow..`}
          </div>
        ) : (
          <Button
            type="primary"
            size="ultra"
            className="w-full mx-auto max-w-[356px] md:!w-[356px]  !rounded-xl"
            onClick={handleJoinUs}>
            Enrol
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
