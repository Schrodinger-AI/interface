'use client';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IScrollAlertItem } from 'components/ScrollAlert';
import useGetNoticeData from './hooks/useGetNoticeData';
import { useCmsInfo } from 'redux/hooks';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useJumpToPage } from 'hooks/useJumpToPage';
import useLoading from 'hooks/useLoading';
import StrayCats from 'pageComponents/strayCats';
import BackCom from './components/BackCom';
import useTelegram from 'hooks/useTelegram';
import { PAGE_CONTAINER_ID } from 'constants/index';
import CommonTabs from 'components/CommonTabs';
import { TabsProps } from 'antd';

const pageStateList: TabsProps['items'] = [
  // {
  //   key: `${ListTypeEnum.All}`,
  //   label: 'All Cats',
  // },
  {
    key: `${ListTypeEnum.My}`,
    label: 'My Cats',
  },
  {
    key: `${ListTypeEnum.Blind}`,
    label: 'Cat Box',
  },
  {
    key: `${ListTypeEnum.Stray}`,
    label: 'Stray Cats',
  },
];

export default function TokensPage() {
  const { getNoticeData } = useGetNoticeData();
  const searchParams = useSearchParams();
  const pageState: ListTypeEnum = useMemo(
    () => (Number(searchParams.get('pageState')) as ListTypeEnum) || ListTypeEnum.My,
    [searchParams],
  );
  const router = useRouter();
  const { isLogin } = useGetLoginStatus();
  const { checkLogin } = useCheckLoginAndToken();
  const { closeLoading } = useLoading();

  const cmsInfo = useCmsInfo();
  const { jumpToPage } = useJumpToPage();

  const [noticeData, setNoticeData] = useState<IScrollAlertItem[]>([]);
  const { isInTelegram } = useTelegram();

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  const getNotice = useCallback(async () => {
    try {
      const res = await getNoticeData();
      setNoticeData(res);
    } catch (error) {
      setNoticeData([]);
    }
  }, [getNoticeData]);

  useEffect(() => {
    getNotice();
  }, [getNotice]);

  const onTabsChange = (value: ListTypeEnum) => {
    if ([ListTypeEnum.My, ListTypeEnum.Stray].includes(value)) {
      if (!isLogin) {
        checkLogin({
          onSuccess: () => {
            router.replace(`/telegram/?pageState=${value}`);
          },
        });
        return;
      }
    }
    router.replace(`/telegram/?pageState=${value}`);
  };

  return (
    <div className="flex flex-col max-w-[2560px] w-full h-full overflow-scroll bg-pixelsPageBg" id={PAGE_CONTAINER_ID}>
      <BackCom className="mt-6 m-4 ml-4 lg:ml-10" url="/telegram/home" theme="dark" />
      <div
        className={clsx(
          'flex flex-col-reverse lg:flex-row justify-between px-0 lg:px-[40px]',
          cmsInfo?.bannerConfig ? 'mt-[24px]' : 'mt-0',
        )}>
        <CommonTabs
          options={pageStateList}
          activeKey={`${pageState}`}
          onTabsChange={(value) => onTabsChange(Number(value) as ListTypeEnum)}
          theme="dark"
          className="mb-[16px] lg:mb-0 px-[16px] lg:px-0 w-full lg:w-[364px]"
        />
      </div>

      <div className="px-4 lg:px-10">
        {pageState === ListTypeEnum.Stray ? (
          <StrayCats theme="dark" />
        ) : (
          <OwnedItems theme="dark" hideFilter={pageState === ListTypeEnum.Blind} />
        )}
      </div>
    </div>
  );
}
