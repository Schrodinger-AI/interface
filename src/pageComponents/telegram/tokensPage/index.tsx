'use client';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IScrollAlertItem } from 'components/ScrollAlert';
import useGetNoticeData from './hooks/useGetNoticeData';
import { useCmsInfo } from 'redux/hooks';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { useTimeoutFn } from 'react-use';
import useLoading from 'hooks/useLoading';
import StrayCats from 'pageComponents/strayCats';
import BackCom from './components/BackCom';
import useTelegram from 'hooks/useTelegram';
import { PAGE_CONTAINER_ID } from 'constants/index';
import CommonTabs from 'components/CommonTabs';
import { TabsProps } from 'antd';

const pageStateList: TabsProps['items'] = [
  {
    key: `${ListTypeEnum.All}`,
    label: 'All Cats',
  },
  {
    key: `${ListTypeEnum.My}`,
    label: 'My Cats',
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
    () => (Number(searchParams.get('pageState')) as ListTypeEnum) || ListTypeEnum.All,
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

  useTimeoutFn(() => {
    if (!isLogin && Number(searchParams.get('pageState')) === ListTypeEnum.My) {
      closeLoading();
      router.replace('/telegram');
    }
  }, 3000);

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
          defaultValue={pageState}
          onTabsChange={(value) => onTabsChange(value as ListTypeEnum)}
          theme="dark"
          className="mb-[16px] lg:mb-0 px-[16px] lg:px-0 w-full lg:w-[364px]"
        />

        {!isInTG && cmsInfo?.operationButtons?.length ? (
          <div
            className={clsx(
              'flex justify-end fixed lg:static bottom-0 left-0 z-20 bg-neutralWhiteBg p-[16px] lg:p-0 w-full lg:w-auto border-0 border-t-[1px] border-solid border-neutralDivider lg:border-none',
            )}>
            {cmsInfo.operationButtons.map((item, index) => {
              return (
                <Button
                  key={index}
                  type={item.buttonType}
                  className={clsx(
                    '!rounded-lg flex-1 overflow-hidden lg:flex-none',
                    index === 0 ? '' : 'ml-[16px]',
                    item?.buttonType === 'default' ? 'border-brandDefault text-brandDefault' : '',
                  )}
                  onClick={() => {
                    jumpToPage({
                      link: item.link,
                      linkType: item.linkType,
                    });
                  }}>
                  {item.text}
                </Button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="px-4 lg:px-10">
        {pageState === ListTypeEnum.Stray ? <StrayCats theme="dark" /> : <OwnedItems theme="dark" />}
      </div>
    </div>
  );
}
