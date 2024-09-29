/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useMemo } from 'react';
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
import { useBuyToken } from 'hooks/useBuyToken';
import { TModalTheme } from 'components/CommonModal';

function StepsCard({ cardList, theme = 'light' }: { cardList: IEventsDetailListStepsCard[]; theme?: TModalTheme }) {
  const { isXL } = useResponsive();
  const { isLogin } = useGetLoginStatus();
  const { checkLogin } = useCheckLoginAndToken();
  const router = useRouter();
  const { jumpToPage } = useJumpToPage();
  const { checkBalanceAndJump } = useBuyToken();

  const isDark = useMemo(() => theme === 'dark', [theme]);

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
                className={clsx(
                  'text-sm font-medium mt-[4px]',
                  isDark ? 'text-pixelsDivider' : 'text-neutralSecondary',
                )}
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

  const onStepClick = useCallback(
    (item: Omit<IEventsDetailListStepsCardImage, 'className'>) => {
      if (item.linkType === 'buyModal') {
        checkBalanceAndJump({
          type: item.buyType || 'buySGR',
          theme: 'light',
        });
      } else {
        jumpToPage({
          link: item.url,
          linkType: item.linkType,
        });
      }
    },
    [checkBalanceAndJump, jumpToPage],
  );
  const renderLink = (link?: Omit<IEventsDetailListStepsCardImage, 'className'>[]) => {
    if (link && link?.length) {
      return (
        <span className={clsx(styles['rules-card-description'], 'flex flex-col')}>
          {link?.map((item, index) => {
            if (!item.link) return null;
            return (
              <span
                key={index}
                className={clsx(
                  'text-sm font-medium cursor-pointer mt-[4px]',
                  isDark ? 'text-pixelsSecondaryTextPurple' : 'text-brandDefault',
                )}
                dangerouslySetInnerHTML={{
                  __html: item.link,
                }}
                onClick={() => onStepClick(item)}
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
                'py-[8px] flex-1 px-[24px] flex items-center h-[120px] bg-[auto_100%] bg-right bg-no-repeat',
                isXL ? 'flex-none' : 'flex-1',
                isXL ? 'w-full' : 'w-auto',
                isDark
                  ? 'rounded-none bg-pixelsModalBg border border-solid border-pixelsBorder'
                  : 'shadow-cardShadow rounded-lg',
              )}
              style={{
                backgroundImage: `url(${
                  isDark ? item.darkBackgroundImage || item.backgroundImage : item.backgroundImage
                })`,
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
                {item?.title && (
                  <span className={clsx('text-base font-medium', isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                    {item?.title}
                  </span>
                )}
                {renderDescription(item?.description)}
                {renderLink(item.link)}
              </div>
            </div>
            <div className={clsx(isXL ? 'mt-[12px] rotate-90' : 'ml-[24px]')}>
              {index < cardList.length - 1 ? (
                <NextArrow className={clsx(isDark && 'fill-pixelsDivider')} />
              ) : (
                <div className="w-[25px]" />
              )}
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

export default React.memo(StepsCard);
