/* eslint-disable react/no-unescaped-entities */
import { useResponsive } from 'hooks/useResponsive';
import React, { useCallback } from 'react';
import { IEventsDetailListLink, IEventsDetailList } from '../types/type';
import EventsTable from './EventsTable';
import SkeletonImage from 'components/SkeletonImage';
import { ReactComponent as RightArrow } from 'assets/img/right_arrow.svg';
import clsx from 'clsx';
import { openExternalLink } from 'utils/openlink';
import { NEED_LOGIN_PAGE } from 'constants/router';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import StepsCard from './StepsCard';
import HandleCard from './HandleCard';

function EventsDetailsList({
  title,
  description,
  eventsTable,
  bottomDescription,
  link,
  stepsCardList,
  subTitle,
  titleIcon,
  handleCard,
  timeCard,
  isFinal = false,
  eventInProgressTime,
  eventDisplayedTime,
}: IEventsDetailList & {
  isFinal?: boolean;
  eventInProgressTime?: [string, string];
  eventDisplayedTime?: [string, string];
}) {
  const { isLG } = useResponsive();
  const { checkLogin } = useCheckLoginAndToken();
  const router = useRouter();
  const { isLogin } = useGetLoginStatus();

  const renderDescription = (description?: string[]) => {
    if (description?.length) {
      return (
        <span className="flex flex-col">
          {description.map((item, index) => {
            return (
              <span
                key={index}
                className="text-sm text-neutralSecondary mt-[8px]"
                dangerouslySetInnerHTML={{
                  __html: item,
                }}
              />
            );
          })}
        </span>
      );
    }
    return null;
  };

  const renderTime = (timeDescription?: string[]) => {
    if (timeDescription?.length) {
      return (
        <span className="flex flex-col">
          {timeDescription.map((item, index) => {
            const formatTime = item
              .replace('{inProgressStartTime}', eventInProgressTime?.[0] || '')
              .replace('{inProgressEndTime}', eventInProgressTime?.[1] || '')
              .replace('{displayedStartTime}', eventDisplayedTime?.[0] || '')
              .replace('{displayedEndTime}', eventDisplayedTime?.[1] || '');
            return (
              <span
                key={index}
                className="text-sm text-neutralSecondary mt-[8px]"
                dangerouslySetInnerHTML={{
                  __html: formatTime,
                }}
              />
            );
          })}
        </span>
      );
    }
    return null;
  };

  const renderSubTitle = (subTitle?: string[]) => {
    if (subTitle?.length) {
      return (
        <span className="flex flex-col">
          {subTitle.map((item, index) => {
            return (
              <span
                key={index}
                className="text-base text-neutralPrimary mt-[8px] flex"
                dangerouslySetInnerHTML={{
                  __html: item,
                }}
              />
            );
          })}
        </span>
      );
    }
    return null;
  };

  const jumpTo = useCallback(
    (link: IEventsDetailListLink) => {
      if (!link.link) return;
      if (link.type === 'externalLink' || link.type === 'img-externalLink') {
        openExternalLink(link.link, '_blank');
      } else {
        if (NEED_LOGIN_PAGE.includes(link.link)) {
          if (isLogin) {
            router.push(link.link);
          } else {
            checkLogin({
              onSuccess: () => {
                if (!link.link) return;
                router.push(link.link);
              },
            });
          }
        } else {
          router.push(link.link);
        }
      }
    },
    [checkLogin, isLogin, router],
  );

  const renderLink = useCallback(
    (link: IEventsDetailListLink) => {
      switch (link.type) {
        case 'img-link':
        case 'img-externalLink':
          return (
            <span
              className={clsx('flex w-full h-auto mt-[8px] overflow-hidden', link.link ? 'cursor-pointer' : '')}
              onClick={() => jumpTo(link)}>
              <SkeletonImage
                img={isLG ? link.imgUrl?.mobile || '' : link.imgUrl?.pc || ''}
                className="w-full h-full"
                imageClassName="!rounded-none"
              />
            </span>
          );
        case 'link':
        case 'externalLink':
          return (
            <span
              className={clsx('w-max max-w-full flex items-center mt-[8px]', link.link ? 'cursor-pointer' : '')}
              onClick={() => jumpTo(link)}>
              <span className="flex items-center text-brandDefault font-medium text-sm">
                {link.text}
                <RightArrow className="fill-brandDefault ml-[2px]" />
              </span>
            </span>
          );
      }
    },
    [isLG, jumpTo],
  );

  return (
    <div className="mt-[24px]">
      {title ? (
        <p className="flex">
          {titleIcon ? (
            <div className="h-[28px] flex items-center mr-[12px]">
              <SkeletonImage
                className={'w-[24px] h-[24px] !rounded-none'}
                img={titleIcon}
                imageClassName="!rounded-none"
              />
            </div>
          ) : null}
          <span className="text-xl font-semibold text-neutralPrimary">{title}</span>
        </p>
      ) : null}
      {subTitle && subTitle.length ? renderSubTitle(subTitle) : null}
      {description && description.length ? renderDescription(description) : null}
      {timeCard && timeCard.length ? renderTime(timeCard) : null}
      {link && link.length ? (
        <div className="flex flex-col">
          {link.map((item) => {
            return renderLink(item);
          })}
        </div>
      ) : null}
      {handleCard && handleCard.length ? <HandleCard handleCardList={handleCard} /> : null}
      <StepsCard cardList={stepsCardList || []} />
      {eventsTable?.header?.length || eventsTable?.server ? <EventsTable {...eventsTable} isFinal={isFinal} /> : null}
      {bottomDescription && bottomDescription.length ? renderDescription(bottomDescription) : null}
    </div>
  );
}

export default React.memo(EventsDetailsList);
