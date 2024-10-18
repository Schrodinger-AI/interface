import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { ReactComponent as HomeSelectedSVG } from 'assets/img/telegram/tabs/Tab_Home_selected.svg';
import { ReactComponent as HomeUnSelectedSVG } from 'assets/img/telegram/tabs/Tab_Home_unselected.svg';
import { ReactComponent as TasksSelectedSVG } from 'assets/img/telegram/tabs/Tab_Tasks_selected.svg';
import { ReactComponent as TasksUnSelectedSVG } from 'assets/img/telegram/tabs/Tab_Tasks_unselected.svg';
import { ReactComponent as EarnSelectedSVG } from 'assets/img/telegram/tabs/Tab_Earn_selected.svg';
import { ReactComponent as EarnUnSelectedSVG } from 'assets/img/telegram/tabs/Tab_Earn_unselected.svg';
import { ReactComponent as FriendSelectedSVG } from 'assets/img/telegram/tabs/Tab_Friends_selected.svg';
import { ReactComponent as FriendUnSelectedSVG } from 'assets/img/telegram/tabs/Tab_Friends_unselected.svg';
import HomeIcon from 'assets/img/telegram/tabs/home.png';
import TasksIcon from 'assets/img/telegram/tabs/tasks.png';
import FriendsIcon from 'assets/img/telegram/tabs/friends.png';
import EarnIcon from 'assets/img/telegram/tabs/earn.png';
import Link from 'next/link';
import { Flex } from 'antd';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function FooterButtons() {
  const pathname = usePathname();

  const { isLogin } = useGetLoginStatus();

  return (
    <div className="w-full fixed bottom-0 left-0 h-[72px] px-[16px] z-10">
      <div className="shadow-floatingButtonsShadow bg-floatingButtonsBg rounded-[8px] h-[50px]">
        <div className="flex gap-[16px] justify-center items-center relative top-[-16px]">
          <Link href={'/telegram/home'} className="flex-1">
            <Flex vertical align="center" justify="center" className="!w-full">
              {pathname === '/telegram/home' ? (
                <HomeSelectedSVG className="w-[40px] h-[40px]" />
              ) : (
                <HomeUnSelectedSVG className="w-[40px] h-[40px]" />
              )}

              <Image src={HomeIcon} className="w-auto h-[10px] mt-[4px]" alt="" />
            </Flex>
          </Link>
          <Link href={isLogin ? '/telegram/tasks' : '/telegram/tasks'} className="flex-1">
            <Flex vertical align="center" justify="center" className="!w-full">
              {pathname === '/telegram/tasks' ? (
                <TasksSelectedSVG className="w-[40px] h-[40px]" />
              ) : (
                <TasksUnSelectedSVG className="w-[40px] h-[40px]" />
              )}
              <Image src={TasksIcon} className="w-auto h-[10px] mt-[4px]" alt="" />
            </Flex>
          </Link>
          <Link href={isLogin ? '/tg-referral' : ''} className="flex-1">
            <Flex vertical align="center" justify="center" className="!w-full">
              {pathname === '/tg-referral' ? (
                <FriendSelectedSVG className="w-[40px] h-[40px]" />
              ) : (
                <FriendUnSelectedSVG className="w-[40px] h-[40px]" />
              )}
              <Image src={FriendsIcon} className="w-auto h-[10px] mt-[4px]" alt="" />
            </Flex>
          </Link>
          <Link href={isLogin ? '/summary-points' : ''} className="flex-1">
            <Flex vertical align="center" justify="center" className="!w-full">
              {pathname === '/summary-points' ? (
                <EarnSelectedSVG className="w-[40px] h-[40px]" />
              ) : (
                <EarnUnSelectedSVG className="w-[40px] h-[40px]" />
              )}
              <Image src={EarnIcon} className="w-auto h-[10px] mt-[4px]" alt="" />
            </Flex>
          </Link>
        </div>
      </div>
    </div>
  );
}
