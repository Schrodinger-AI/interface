/* eslint-disable react/no-unescaped-entities */
import { useResponsive } from 'hooks/useResponsive';
import React, { useCallback } from 'react';
import { IActivityDetailRules, IActivityDetailRulesLink } from 'redux/types/reducerTypes';
import RulesTable from './RulesTable';
import SkeletonImage from 'components/SkeletonImage';
import clsx from 'clsx';

function RulesList({ title, description, rulesTable, bottomDescription, link }: IActivityDetailRules) {
  const { isLG } = useResponsive();

  const renderDescription = (description?: string[]) => {
    if (description?.length) {
      return (
        <span className="flex flex-col">
          {description.map((item, index) => {
            return (
              <span key={index} className="text-base font-medium text-neutralSecondary mt-[8px]">
                {item}
              </span>
            );
          })}
        </span>
      );
    }
    return null;
  };

  const renderLink = useCallback(
    (link: IActivityDetailRulesLink) => {
      switch (link.type) {
        case 'img-link':
          return (
            <a
              href={link.link}
              rel="noreferrer"
              className={clsx('flex w-full mt-[8px] cursor-pointer overflow-hidden')}
              style={link.style}>
              <SkeletonImage img={isLG ? link.imgUrl?.mobile || '' : link.imgUrl?.pc || ''} className="w-full h-full" />
            </a>
          );
        case 'img-externalLink':
          return (
            <a
              href={link.link}
              target="_blank"
              rel="noreferrer"
              className={clsx('flex w-full mt-[8px] cursor-pointer overflow-hidden')}>
              <SkeletonImage img={isLG ? link.imgUrl?.mobile || '' : link.imgUrl?.pc || ''} className="w-full h-full" />
            </a>
          );
        case 'link':
          return (
            <a
              href={link.link}
              rel="noreferrer"
              className={clsx('w-full mt-[8px] text-brandDefault font-medium text-base cursor-pointer', link.style)}>
              {link.text}
            </a>
          );
        case 'externalLink':
          return (
            <a
              href={link.link}
              target="_blank"
              rel="noreferrer"
              className={clsx('w-full mt-[8px] text-brandDefault font-medium text-base cursor-pointer', link.style)}>
              {link.text}
            </a>
          );
      }
    },
    [isLG],
  );

  return (
    <div>
      {title ? <p className="text-xl font-semibold">{title}</p> : null}
      {description && description.length ? renderDescription(description) : null}
      {link && link.length ? (
        <div className="flex flex-col">
          {link.map((item) => {
            return renderLink(item);
          })}
        </div>
      ) : null}
      {rulesTable?.header.length ? <RulesTable {...rulesTable} /> : null}
      {bottomDescription && bottomDescription.length ? renderDescription(bottomDescription) : null}
    </div>
  );
}

export default React.memo(RulesList);
