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
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import SyncingOnChainLoading from 'components/SyncingOnChainLoading';
import { useModal } from '@ebay/nice-modal-react';
import useGetUnfinishedTasks from './useGetUnfinishedTasks';

export default function FooterButtons() {
  const pathname = usePathname();
  const router = useRouter();
  const syncingOnChainLoading = useModal(SyncingOnChainLoading);
  const { hasUnfinishedTasks } = useGetUnfinishedTasks();

  const { isLogin } = useGetLoginStatus();
  const onHandleClick = (href: string) => {
    if (isLogin) {
      router.push(href);
    } else {
      syncingOnChainLoading.show({
        checkLogin: true,
      });
    }
  };

  return (
    <div className="w-full fixed bottom-0 left-0 h-[72px] px-[16px] z-[60]">
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
          <div onClick={() => onHandleClick('/telegram/tasks')} className="flex-1">
            <Flex vertical align="center" justify="center" className="!w-full">
              <div className="relative">
                {hasUnfinishedTasks ? (
                  <div className="absolute top-[0] right-[0] w-[8px] h-[8px] rounded-[4px] bg-functionalError" />
                ) : null}

                {pathname === '/telegram/tasks' ? (
                  <TasksSelectedSVG className="w-[40px] h-[40px]" />
                ) : (
                  <TasksUnSelectedSVG className="w-[40px] h-[40px]" />
                )}
              </div>

              <Image src={TasksIcon} className="w-auto h-[10px] mt-[4px]" alt="" />
            </Flex>
          </div>
          <div onClick={() => onHandleClick('/tg-referral')} className="flex-1">
            <Flex vertical align="center" justify="center" className="!w-full">
              {pathname === '/tg-referral' ? (
                <FriendSelectedSVG className="w-[40px] h-[40px]" />
              ) : (
                <FriendUnSelectedSVG className="w-[40px] h-[40px]" />
              )}
              <Image src={FriendsIcon} className="w-auto h-[10px] mt-[4px]" alt="" />
            </Flex>
          </div>
          <div onClick={() => onHandleClick('/summary-points')} className="flex-1">
            <Flex vertical align="center" justify="center" className="!w-full">
              {pathname === '/summary-points' ? (
                <EarnSelectedSVG className="w-[40px] h-[40px]" />
              ) : (
                <EarnUnSelectedSVG className="w-[40px] h-[40px]" />
              )}
              <Image src={EarnIcon} className="w-auto h-[10px] mt-[4px]" alt="" />
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
}
