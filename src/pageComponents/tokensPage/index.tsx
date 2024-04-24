'use client';
import TokensInfo from 'components/TokensInfo';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import { useEffect, useState } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { getNoticeData } from './utils/getNoticeData';
import { IScrollAlertItem } from 'components/ScrollAlert';

export default function TokensPage() {
  const cmsInfo = useCmsInfo();

  const [noticeData, setNoticeData] = useState<IScrollAlertItem[]>([]);

  useEffect(() => {
    const res = getNoticeData(cmsInfo);
    setNoticeData(res);
  }, [cmsInfo]);

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      <TokensInfo />
      <OwnedItems noticeData={noticeData} pageState={ListTypeEnum.All} />
    </div>
  );
}
