'use client';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import { useCallback, useEffect, useState } from 'react';
import ScrollAlert, { IScrollAlertItem } from 'components/ScrollAlert';
import useGetNoticeData from './hooks/useGetNoticeData';
import { useCmsInfo } from 'redux/hooks';
import TopBanner from 'components/TopBanner';
import { useResponsive } from 'hooks/useResponsive';

export default function TokensPage() {
  const { getNoticeData } = useGetNoticeData();
  const { isLG } = useResponsive();

  const cmsInfo = useCmsInfo();

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

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      {cmsInfo?.bannerConfig ? <TopBanner /> : null}
      {isLG && noticeData?.length ? (
        <div className="w-full overflow-hidden">
          <ScrollAlert data={noticeData} type="notice" />
        </div>
      ) : null}
      <div className="px-4 lg:px-10 mt-[24px]">
        <OwnedItems noticeData={noticeData} pageState={ListTypeEnum.All} />
      </div>
    </div>
  );
}
