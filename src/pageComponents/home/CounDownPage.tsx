import { Button } from 'aelf-design';
import CountDownModule from './components/CountDownModule';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import SocialMedia, { SocialMediaItem } from './components/SocialMedia';
import useCheckJoinStatus from './hooks/useCheckJoinStatus';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';
import { ewellUrl } from 'constants/index';
import { HomeHostTag } from 'components/HostTag';
import { isMobileDevices } from 'utils/isMobile';
import { useMemo } from 'react';

export default function CountDownPage() {
  const isMobile = useMemo(() => !!isMobileDevices(), []);

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
    {
      index: 3,
      icon: '',
      link: 'https://t.me/projectschrodingercat',
      target: '',
      name: 'telegram',
    },
    {
      index: 4,
      icon: '',
      link: 'https://schrodingernft.gitbook.io/schroedingers-cat/',
      target: '',
      name: 'gitbook',
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
    <div className="relative">
      <section className="pt-[56px] md:pt-[80px] pb-[64px] flex flex-col items-center w-full z-10">
        <div className="relative flex w-full justify-center">
          <img
            src={require('assets/img/schrodinger.jpeg').default.src}
            alt="Schrödinger"
            className="rounded-lg md:rounded-xl w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
          />
          <HomeHostTag />
        </div>
        <div className="flex flex-col gap-[16px] mt-[24px] md:mt-[40px] text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] font-semibold text-[#1A1A1A] text-center">
          <p>Generate AI-Powered ACS-404 Inscriptions</p>
          <p>Coming Soon…</p>
        </div>
        <section className="mt-[24px] md:mt-[40px]">
          <CountDownModule targetDate={cmsInfo?.openTimeStamp || ''} />
        </section>
        <section className="mt-[56px] md:mt-[80px] mx-auto w-full">
          {isLogin && isJoin ? (
            <div className="text-[#434343] flex flex-col gap-[16px] text-[14px] leading-[22px] md:gap-[8px] md:text-[16px] md:leading-[24px] font-medium text-center">
              <p>
                {`Congratulations! You're successfully enrolled. Stay tuned for more details on how to own your cat.. meow..`}
              </p>
              <p>
                In preparation for the inscription, you can now acquire the token needed, $SGR, on the IDO launchpad{' '}
                <span
                  className="text-[#3888FF] cursor-pointer"
                  onClick={() => {
                    window.open(ewellUrl, '_blank');
                  }}>
                  ewell
                </span>
                .
              </p>
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
    </div>
  );
}
