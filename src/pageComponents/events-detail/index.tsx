import { getEventDetail, getEventResultDetail, getEventsConfig } from 'api/request';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useLoading from 'hooks/useLoading';
import { IEventsDetailList } from './types/type';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useParams, useRouter } from 'next/navigation';
import EventsDetailsList from './components/EventsDetailsList';
import MobileBackNav from 'components/MobileBackNav';
import { useResponsive } from 'hooks/useResponsive';
import moment from 'moment';
import useTelegram from 'hooks/useTelegram';
import clsx from 'clsx';

export default function ActivityDetail() {
  const { showLoading, closeLoading } = useLoading();
  const router = useRouter();
  const { isLG } = useResponsive();
  const { isInTG } = useTelegram();

  const { id } = useParams() as {
    id: string;
  };

  const [eventsDetailsList, setEventsDetailsList] = useState<IEventsDetailList[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [isFinal, setIsFinal] = useState<boolean>(false);
  const [eventInProgressTime, setEventInProgressTime] = useState<[string, string]>();
  const [eventDisplayedTime, setEventDisplayedTime] = useState<[string, string]>();

  const getEventInfo = useCallback(
    async (id: string) => {
      try {
        if (!id) return;
        showLoading();
        const configData = await getEventsConfig({
          activityId: id,
        });
        const now = new Date().getTime();

        if (!configData) {
          setEventsDetailsList([]);
          setPageTitle('');
          return;
        }

        const showResult: boolean = configData.inProgress.endTime < now || configData.inProgress.startTime > now;

        const requestApi = showResult ? getEventResultDetail : getEventDetail;

        if (showResult) {
          setIsFinal(true);
        } else {
          setIsFinal(false);
        }

        const { data } = await requestApi(id);

        const inProgressStartTime = `${moment(Number(configData.inProgress.startTime))
          .utc()
          .format('YYYY/MM/DD HH:mm:ss')} (UTC)`;
        const inProgressEndTime = `${moment(Number(configData.inProgress.endTime))
          .utc()
          .format('YYYY/MM/DD HH:mm:ss')} (UTC)`;

        setEventInProgressTime([inProgressStartTime, inProgressEndTime]);

        if (configData.displayed) {
          const displayedStartTime = `${moment(Number(configData.displayed.startTime))
            .utc()
            .format('YYYY/MM/DD HH:mm:ss')} (UTC)`;
          const displayedEndTime = `${moment(Number(configData.displayed.endTime))
            .utc()
            .format('YYYY/MM/DD HH:mm:ss')} (UTC)`;

          setEventDisplayedTime([displayedStartTime, displayedEndTime]);
        }

        setEventsDetailsList(data.list || []);
        setPageTitle(data.pageTitle || '');
      } finally {
        closeLoading();
      }
    },
    [closeLoading, showLoading],
  );

  const isDark = useMemo(() => isInTG, [isInTG]);

  useEffect(() => {
    if (!id) return;
    getEventInfo(id);
  }, [getEventInfo, id]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className={clsx('w-full max-w-[1360px]', isInTG ? 'px-[16px] py-[32px]' : '')}>
        {isLG ? <MobileBackNav theme={isInTG ? 'dark' : 'light'} /> : null}

        <h1
          className={clsx(
            'pt-[24px] flex items-start pb-[8px] font-semibold text-2xl',
            isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
          )}>
          {!isLG ? (
            <div className="h-[32px] flex items-center justify-center">
              <ArrowSVG
                className="w-[24px] mr-[8px] rotate-90  cursor-pointer"
                onClick={() => {
                  router.back();
                }}
              />
            </div>
          ) : null}
          <span className="flex-1">{pageTitle}</span>
        </h1>
        <div>
          {eventsDetailsList.map((item, index) => {
            return (
              <EventsDetailsList
                key={index}
                {...item}
                theme={isInTG ? 'dark' : 'light'}
                isFinal={isFinal}
                eventInProgressTime={eventInProgressTime}
                eventDisplayedTime={eventDisplayedTime}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
