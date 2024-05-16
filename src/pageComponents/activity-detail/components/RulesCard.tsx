/* eslint-disable react/no-unescaped-entities */
import React, { useCallback } from 'react';
import { IActivityDetailCard, IActivityDetailCardImage } from 'redux/types/reducerTypes';
import clsx from 'clsx';
import { useResponsive } from 'hooks/useResponsive';
import SkeletonImage from 'components/SkeletonImage';
import styles from './style.module.css';
import { openExternalLink } from 'utils/openlink';
import { NEED_LOGIN_PAGE } from 'constants/router';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import { Row } from 'antd';
import { Col } from 'antd/lib';

function RulesCard({ cardList }: { cardList: IActivityDetailCard[] }) {
  // TODO
  const { isLG } = useResponsive();
  const { isLogin } = useGetLoginStatus();
  const { checkLogin } = useCheckLoginAndToken();
  const router = useRouter();

  const jumpTo = useCallback(
    (image?: IActivityDetailCardImage) => {
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
        <span className={clsx(styles['rules-card-description'])}>
          {description?.map((item, index) => {
            return (
              <span
                key={index}
                className="text-sm font-medium text-neutralSecondary mt-[8px] flex"
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

  if (!cardList || !cardList.length) return null;

  return (
    <Row gutter={[16, 16]}>
      {cardList.map((item, index) => {
        return (
          <Col key={index} className={clsx('')}>
            {item?.image?.url ? (
              <div
                className={clsx('w-max', item?.image.link ? 'cursor-pointer' : '')}
                onClick={() => jumpTo(item?.image)}>
                <SkeletonImage
                  img={item?.image?.url}
                  width={200}
                  height={200}
                  className={clsx('w-[200px] h-[200px] rounded-md', item?.image.className)}
                />
              </div>
            ) : null}
            {item?.title && <span className="text-base text-neutralTitle font-semibold">{item?.title}</span>}
            {renderDescription(item?.description)}
          </Col>
        );
      })}
    </Row>
  );
}

export default React.memo(RulesCard);
