import { Button } from 'aelf-design';
import CountDownModule from './components/CountDownModule';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import SocialMedia, { SocialMediaItem } from './components/SocialMedia';
import useCheckJoinStatus from './hooks/useCheckJoinStatus';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';
import { useModal } from '@ebay/nice-modal-react';
import PromptModal from 'components/PromptModal';
import ResultModal, { Status } from 'components/ResultModal';
import AdoptActionModal from 'components/AdoptActionModal';
import AdopNextModal from 'components/AdoptNextModal';
import { adoptStep1Handler } from 'hooks/Adopt/AdoptStep';
import { HomeHostTag } from 'components/HostTag';
import { isMobileDevices } from 'utils/isMobile';
import { useCallback, useMemo } from 'react';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';

export default function CountDownPage() {
  const isMobile = useMemo(() => !!isMobileDevices(), []);

  const { checkLogin, isOK } = useCheckLoginAndToken();
  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);
  const adoptActionModal = useModal(AdoptActionModal);
  const adoptNextModal = useModal(AdopNextModal);

  const adoptHandler = useAdoptHandler();

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

  const modal = async () => {
    // console.log('=====adopt');
    // resultModal.show({
    //   modalTitle: 'You have failed create tier 2 operational domain',
    //   info: {
    //     name: 'name',
    //   },
    //   status: Status.ERROR,
    //   description:
    //     'If you find an element of your interface requires instructions, then you need to redesign it.If you find an element of your interface requires instructions, then you need to redesign it.If you find an element of your interface requires instructions, then you need to redesign it.If you find an element of your interface requires instructions, then you need to redesign it',
    //   link: {
    //     href: 'llll',
    //   },
    // });
    adoptActionModal.show({
      modalTitle: 'Adopt',
      info: {
        name: 'name',
        // logo: '',
        subName: 'ssss',
        // tag: 'GEN 1',
      },
      onConfirm: () => {
        adoptActionModal.hide();
        promptModal.show({
          info: {
            name: 'name',
            subName: 'subName',
          },
          title: 'message title',
          content: {
            title: 'content title',
            content: 'content content',
          },
          initialization: async () => {
            try {
              await adoptStep1Handler({
                params: {
                  parent: '',
                  amount: '10',
                  domain: '',
                },
                address: '',
                decimals: 8,
              });
              promptModal.hide();
              // show step2 modal
            } catch (error) {
              return Promise.reject(error);
            }
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      },
    });
  };

  const onShowModal = async () => {
    adoptNextModal.show({
      data: {
        SGRToken: {},
        newTraits: [],
        images: ['https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'],
        inheritedTraits: [],
        transaction: {},
        ELFBalance: {},
      },
      onConfirm: (src) => {
        console.log('onConfirm-src', src);
      },
    });
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
      <section className="md:px-6 lg:px-0 pt-[56px] md:pt-[80px] pb-[64px] flex flex-col items-center w-full z-10">
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
                In preparation for the inscription, you can acquire the token needed ,$SGR, on Launchpads on ethereum
                and aelf soon.
              </p>
            </div>
          ) : (
            <>
              <Button
                type="primary"
                size="ultra"
                className="w-full mx-auto max-w-[356px] md:!w-[356px]  !rounded-xl"
                onClick={handleJoinUs}>
                Enrol
              </Button>
              <Button
                type="primary"
                size="ultra"
                className="w-full mt-4 mx-auto max-w-[356px] md:!w-[356px]  !rounded-xl"
                onClick={modal}>
                modal
              </Button>
              <Button
                type="primary"
                size="ultra"
                className="w-full mt-4 mx-auto max-w-[356px] md:!w-[356px]  !rounded-xl"
                onClick={onShowModal}>
                adopt next
              </Button>
              <Button
                type="primary"
                size="ultra"
                className="w-full mt-4 mx-auto max-w-[356px] md:!w-[356px]  !rounded-xl"
                onClick={async () => {
                  adoptHandler(
                    {
                      tick: 'TESTGGRR',
                      symbol: 'TESTGGRR-1',
                      tokenName: 'TESTGGRR',
                      inscriptionImage:
                        'data:image/png;base64,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',
                      amount: '100000000000',
                      generation: 1,
                      blockTime: 1000,
                      decimals: 8,
                      traits: [
                        { traitType: 'Background', value: 'Space Odyssey', percent: 0 },
                        { traitType: 'Background', value: 'Fantasy Forest', percent: 0 },
                      ],
                    },
                    wallet.address,
                  );
                }}>
                adoptHandler
              </Button>
            </>
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
