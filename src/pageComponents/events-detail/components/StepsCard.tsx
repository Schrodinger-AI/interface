/* eslint-disable react/no-unescaped-entities */
import React, { useCallback } from 'react';
import { IEventsDetailListStepsCard, IEventsDetailListStepsCardImage } from '../types/type';
import clsx from 'clsx';
import { useResponsive } from 'hooks/useResponsive';
import SkeletonImage from 'components/SkeletonImage';
import styles from './style.module.css';
import { openExternalLink } from 'utils/openlink';
import { NEED_LOGIN_PAGE } from 'constants/router';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import { Row, Col } from 'antd';
import { ReactComponent as NextArrow } from 'assets/img/icons/next-arrow.svg';
import { useJumpToPage } from 'hooks/useJumpToPage';

function StepsCard({ cardList }: { cardList: IEventsDetailListStepsCard[] }) {
  const { isXL } = useResponsive();
  const { isLogin } = useGetLoginStatus();
  const { checkLogin } = useCheckLoginAndToken();
  const router = useRouter();
  const { jumpToPage } = useJumpToPage();

  const jumpTo = useCallback(
    (image?: IEventsDetailListStepsCardImage) => {
      if (!image || !image.link) return;
      if (image?.linkType === 'externalLink') {
        openExternalLink(image.link, '_blank');
      } else {
        if (NEED_LOGIN_PAGE.includes(image.link)) {
          if (isLogin) {
            router.push(image.link);
          } else {
            checkLogin({
              onSuccess: () => {
                if (!image.link) return;
                router.push(image.link);
              },
            });
          }
        } else {
          router.push(image.link);
        }
      }
    },
    [checkLogin, isLogin, router],
  );

  const renderDescription = (description?: string[]) => {
    if (description && description?.length) {
      return (
        <span className={clsx(styles['rules-card-description'], 'flex flex-col')}>
          {description?.map((item, index) => {
            return (
              <span
                key={index}
                className="text-sm font-medium text-neutralSecondary mt-[4px]"
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

  const renderLink = (link?: Omit<IEventsDetailListStepsCardImage, 'className'>[]) => {
    if (link && link?.length) {
      return (
        <span className={clsx(styles['rules-card-description'], 'flex flex-col')}>
          {link?.map((item, index) => {
            if (!item.link) return null;
            return (
              <span
                key={index}
                className="text-sm font-medium text-brandDefault cursor-pointer mt-[4px]"
                dangerouslySetInnerHTML={{
                  __html: item.link,
                }}
                onClick={() =>
                  jumpToPage({
                    link: item.url,
                    linkType: item.linkType,
                  })
                }
              />
            );
          })}
        </span>
      );
    }
    return null;
  };

  if (!cardList || !cardList.length) return null;

  return (
    <Row gutter={[24, isXL ? 12 : 16]} className="mt-[12px]">
      {cardList.map((item, index) => {
        return (
          <Col span={isXL ? 24 : 8} key={index} className={clsx('flex items-center', isXL ? 'flex-col' : 'flex-row')}>
            <div
              className={clsx(
                'shadow-cardShadow py-[8px] flex-1 px-[24px] rounded-lg flex items-center h-[120px] bg-[auto_100%] bg-right bg-no-repeat',
                isXL ? 'flex-none' : 'flex-1',
                isXL ? 'w-full' : 'w-auto',
              )}
              style={{
                backgroundImage: `url(${item.backgroundImage})`,
              }}>
              {item?.image?.url ? (
                <div
                  className={clsx('w-max mr-[24px]', item?.image.link ? 'cursor-pointer' : '')}
                  onClick={() => jumpTo(item?.image)}>
                  <SkeletonImage
                    img={item?.image?.url}
                    width={48}
                    height={48}
                    className={clsx('w-[48px] h-[48px] rounded-md', item?.image.className)}
                  />
                </div>
              ) : null}
              <div className="flex flex-col">
                {item?.title && <span className="text-base text-neutralTitle font-medium">{item?.title}</span>}
                {renderDescription(item?.description)}
                {renderLink(item.link)}
              </div>
            </div>
            <div className={clsx(isXL ? 'mt-[12px] rotate-90' : 'ml-[24px]')}>
              {index < cardList.length - 1 ? <NextArrow /> : <div className="w-[25px]" />}
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

export default React.memo(StepsCard);
