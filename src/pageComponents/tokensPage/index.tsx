'use client';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ScrollAlert, { IScrollAlertItem } from 'components/ScrollAlert';
import useGetNoticeData from './hooks/useGetNoticeData';
import { useCmsInfo } from 'redux/hooks';
import TopBanner from 'components/TopBanner';
import { Button, Radio } from 'aelf-design';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { useTimeoutFn } from 'react-use';
import useLoading from 'hooks/useLoading';
import CommonRadioTab, { ICommonRadioTabButton } from 'components/CommonRadioTab';

const pageStateList: ICommonRadioTabButton<ListTypeEnum>[] = [
  {
    value: ListTypeEnum.All,
    label: 'All Cats',
  },
  {
    value: ListTypeEnum.RARE,
    label: 'Rare Cats',
  },
  {
    value: ListTypeEnum.My,
    label: 'My Cats',
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

  const onRadioChange = (value: ListTypeEnum) => {
    if (value === ListTypeEnum.My) {
      if (!isLogin) {
        checkLogin({
          onSuccess: () => {
            router.replace(`/?pageState=${value}`);
          },
        });
        return;
      }
    }
    router.replace(`/?pageState=${value}`);
  };

  useTimeoutFn(() => {
    if (!isLogin && Number(searchParams.get('pageState')) === ListTypeEnum.My) {
      closeLoading();
      router.replace('/');
    }
  }, 3000);

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      {cmsInfo?.bannerConfig ? <TopBanner /> : null}
      <div
        className={clsx(
          'flex flex-col-reverse lg:flex-row justify-between px-0 lg:px-[40px]',
          cmsInfo?.bannerConfig ? 'mt-[24px]' : 'mt-0',
        )}>
        <CommonRadioTab
          buttons={pageStateList}
          value={pageState}
          onRadioChange={onRadioChange}
          className="mb-[16px] lg:mb-0 px-[16px] lg:px-0 w-full lg:w-[364px]"
        />
        {noticeData && noticeData?.length ? (
          <div className="flex-1 overflow-hidden ml-0 lg:ml-5 h-[48px] mb-[16px] lg:mb-0 mr-0 lg:mr-[12px]">
            <ScrollAlert data={noticeData} type="notice" />
          </div>
        ) : null}

        {cmsInfo?.operationButtons?.length ? (
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
        <OwnedItems />
      </div>
    </div>
  );
}
