/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter } from 'next/navigation';
import useTelegram from 'hooks/useTelegram';
import MobileBackNav from 'components/MobileBackNav';

function MergeTutorial() {
  const { isInTG } = useTelegram();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();

  return (
    <div className={clsx('w-full h-full py-[16px] max-w-[668px] mx-auto')}>
      <div className={clsx('block px-[16px]')}>
        <MobileBackNav theme={'dark'} />
      </div>
    </div>
  );
}

export default MergeTutorial;
