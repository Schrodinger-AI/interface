'use client';
import OwnedItems from 'components/OwnedItems';
import { useCmsInfo } from 'redux/hooks';
import TopBanner from 'components/TopBanner';

export default function TokensPage() {
  const cmsInfo = useCmsInfo();

  return (
    <div className="flex flex-col max-w-[2560px] w-full">
      {cmsInfo?.bannerConfig ? <TopBanner /> : null}
      <div className="px-4 lg:px-10 mt-[24px]">
        <OwnedItems />
      </div>
    </div>
  );
}
