'use client';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import useLoading from 'hooks/useLoading';
import { useTimeoutFn } from 'react-use';
import { useRouter } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';
import TopBanner from 'components/TopBanner';

export default function TokensPage() {
  const { isLogin } = useGetLoginStatus();
  const { closeLoading } = useLoading();
  const router = useRouter();
  const cmsInfo = useCmsInfo();

  useTimeoutFn(() => {
    if (!isLogin) {
      closeLoading();
      router.replace('/');
    }
  }, 3000);

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      {cmsInfo?.bannerConfig ? <TopBanner /> : null}
      <div className="px-4 lg:px-10 mt-[24px]">
        <OwnedItems pageState={ListTypeEnum.My} />
      </div>
    </div>
  );
}
