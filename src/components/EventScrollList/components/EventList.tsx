import SkeletonImage from 'components/SkeletonImage';
import React, { useMemo } from 'react';
import moment from 'moment';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { ZERO } from 'constants/misc';

function EventList({
  bannerUrl,
  activityName,
  beginTime,
  endTime,
  isNew = false,
  linkUrl,
  linkType = 'link',
}: IActivityListItem) {
  const { jumpToPage } = useJumpToPage();

  const isExpired = useMemo(() => {
    if (!endTime) return false;
    const now = new Date().getTime();
    return ZERO.plus(now).gte(ZERO.plus(endTime));
  }, [endTime]);

  const formatTime = useMemo(() => {
    if (!endTime || !beginTime) return false;

    return `${moment(Number(beginTime)).utc().format('YYYY/MM/DD')} (UTC) ~ ${moment(Number(endTime))
      .utc()
      .format('YYYY/MM/DD')} (UTC)`;
  }, [beginTime, endTime]);

  return (
    <div className="lg:px-[22px]">
      <div className="p-[2px] relative">
        <div
          className="relative w-full h-auto cursor-pointer shadow-cardShadow2 overflow-hidden rounded-lg mb-[16px] lg:mb-[24px]"
          onClick={() =>
            jumpToPage({
              link: linkUrl,
              linkType,
            })
          }>
          <div className="w-full h-[128px]">
            <SkeletonImage
              img={bannerUrl}
              imageSizeType="cover"
              className="w-full h-full overflow-visible"
              imageClassName="rounded-none"
            />
          </div>

          <div className="p-[16px]">
            <p className="text-base text-neutralTitle font-medium mb-[8px]">{activityName}</p>
            {formatTime ? <p className="text-xs text-neutralSecondary">{formatTime}</p> : null}
          </div>
          {isExpired ? <div className="absolute top-0 left-0 w-full h-full bg-neutralWhiteBg opacity-60 z-10" /> : null}
        </div>
        {isNew ? (
          <div className="absolute top-0 right-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={require('assets/img/event/tag-new.png').default.src} alt="new" className="w-[44px] h-auto" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(EventList);
