/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter } from 'next/navigation';
import useTelegram from 'hooks/useTelegram';
import MobileBackNav from 'components/MobileBackNav';
import RewardsCard from 'pageComponents/tg-home/components/RewardsCard';
import styles from './style.module.css';
import cat from 'assets/img/telegram/breed/cat.png';
import { ReactComponent as CatIcon } from 'assets/img/telegram/merge-tutorial/icon_cat.svg';
import { ReactComponent as GoldIcon } from 'assets/img/telegram/merge-tutorial/icon_gold.svg';
import { ReactComponent as VouchersIcon } from 'assets/img/telegram/merge-tutorial/icon_vouchers.svg';
import Image from 'next/image';
import TgCard from 'components/TgCard';

const list = [
  {
    id: 'vouchers',
    icon: <VouchersIcon />,
    title: 'Free Entry',
    describe: 'Best for grinders. Adopt with vouchers & Invite to boost your odds! ',
  },
  {
    id: 'gold',
    icon: <GoldIcon />,
    title: 'Win Big',
    describe: 'Best for lucky players. Adopt with $SGR & claim 5x vouchers!',
  },
  {
    id: 'cat',
    icon: <CatIcon />,
    title: 'Higher Odds',
    describe: 'Best for whales. Merge to level up & climb up the leaderboard!',
  },
];

function MergeTutorial() {
  const { isInTG } = useTelegram();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();

  return (
    <div className={clsx('w-full h-full p-[16px] max-w-[668px] mx-auto', styles['merge-tutorial-wrap'])}>
      <div className={clsx('block')}>
        <MobileBackNav theme={'dark'} />
      </div>
      <div className="flex justify-center items-center mb-[16px]">
        <Image src={cat} className="h-[20px] w-auto rotate-y-180" alt="" />
        <span className="text-xl text-pixelsWhiteBg font-black mx-[12px]">How to win?</span>
        <Image src={cat} className="h-[20px] w-auto" alt="" />
      </div>
      <RewardsCard theme="dark" />
      <div className="mt-[16px]">
        <TgCard>
          <p className="w-full text-pixelsWhiteBg text-xl font-black">One winner takes it ALL! </p>

          {list.map((item) => {
            return (
              <div key={item.id} className="flex mt-[24px]">
                <div className=" w-[88px] h-[88px] bg-[#2F2C89] rounded-[8px] flex justify-center items-center">
                  {item.icon}
                </div>
                <div className="flex-1 ml-[16px]">
                  <h2 className="text-base text-pixelsWhiteBg font-black">{item.title}</h2>
                  <p className="text-sm text-botBrand">{item.describe}</p>
                </div>
              </div>
            );
          })}
        </TgCard>
      </div>
    </div>
  );
}

export default MergeTutorial;
