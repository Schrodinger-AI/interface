/* eslint-disable react/no-unescaped-entities */
import { useResponsive } from 'hooks/useResponsive';
import React, { useCallback } from 'react';
import { IActivityDetailRules, IActivityDetailRulesLink } from 'redux/types/reducerTypes';
import RulesTable from './RulesTable';
import SkeletonImage from 'components/SkeletonImage';
import { ReactComponent as RightArrow } from 'assets/img/right_arrow.svg';
import clsx from 'clsx';
import { openExternalLink } from 'utils/openlink';
import { NEED_LOGIN_PAGE } from 'constants/router';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { useRouter } from 'next/navigation';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import RulesCard from './RulesCard';

function RulesList({ title, description, rulesTable, bottomDescription, link, cardList }: IActivityDetailRules) {
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

  const jumpTo = useCallback(
    (link: IActivityDetailRulesLink) => {
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
    (link: IActivityDetailRulesLink) => {
      switch (link.type) {
        case 'img-link':
        case 'img-externalLink':
          return (
            <span
              className={clsx('flex w-full h-auto mt-[8px] overflow-hidden', link.link ? 'cursor-pointer' : '')}
              onClick={() => jumpTo(link)}>
              <SkeletonImage img={isLG ? link.imgUrl?.mobile || '' : link.imgUrl?.pc || ''} className="w-full h-full" />
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
      {title ? <p className="text-base font-medium text-neutralPrimary">{title}</p> : null}
      {description && description.length ? renderDescription(description) : null}
      {link && link.length ? (
        <div className="flex flex-col">
          {link.map((item) => {
            return renderLink(item);
          })}
        </div>
      ) : null}
      <RulesCard cardList={cardList || []} />
      {rulesTable?.header.length ? <RulesTable {...rulesTable} /> : null}
      {bottomDescription && bottomDescription.length ? renderDescription(bottomDescription) : null}
    </div>
  );
}

export default React.memo(RulesList);
