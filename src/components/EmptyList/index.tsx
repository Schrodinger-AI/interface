import clsx from 'clsx';
import styles from './index.module.css';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';
import { ReactComponent as ArchivePurpleSVG } from 'assets/img/archive-purple.svg';
import { useCmsInfo } from 'redux/hooks';
import { useCallback, useMemo } from 'react';
import { ReactComponent as ArrowSVG } from 'assets/img/icons/arrow.svg';
import { openExternalLink } from 'utils/openlink';
import Banner from './components/Banner';
import Introduction from './components/Introduction';
import { Col, Row } from 'antd';
import useResponsive from 'hooks/useResponsive';
import { Ellipsis } from 'antd-mobile';
import { TModalTheme } from 'components/CommonModal';

export interface IEmptyListProps {
  isChannelShow?: boolean;
  defaultDescription?: string;
  className?: string;
  theme?: TModalTheme;
}

export const EmptyList = ({
  isChannelShow = false,
  defaultDescription = '',
  className,
  theme = 'light',
}: IEmptyListProps) => {
  const cmsInfo = useCmsInfo();
  const { isLG } = useResponsive();

  const emptyChannelGroupList = useMemo(() => {
    return cmsInfo?.emptyChannelGroupList || [];
  }, [cmsInfo?.emptyChannelGroupList]);

  const descriptionList = useMemo(() => {
    if (!isChannelShow) return [defaultDescription];
    return cmsInfo?.emptyChannelGroupDescription || [];
  }, [cmsInfo?.emptyChannelGroupDescription, defaultDescription, isChannelShow]);

  const gitBookDescription = useMemo(() => cmsInfo?.gitBookDescription || '', [cmsInfo?.gitBookDescription]);
  const gitBookLink = useMemo(() => cmsInfo?.gitBookLink || '', [cmsInfo?.gitBookLink]);

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const onChannelClick = useCallback((url: string) => {
    if (!url) return;
    openExternalLink(url, '_blank');
  }, []);

  return (
    <div className={clsx([styles.emptyListWrap, className])}>
      {isDark ? <ArchivePurpleSVG className={styles.emptyImg} /> : <ArchiveSVG className={styles.emptyImg} />}

      <div className={clsx('flex flex-col items-start pt-[8px]', isChannelShow ? 'w-full' : 'w-auto')}>
        {descriptionList.map((item, idx) => (
          <div key={idx} className={clsx(styles.emptyTips, isDark ? 'text-pixelsBorder' : 'text-neutralPrimary')}>
            {item}
          </div>
        ))}
      </div>

      {isChannelShow &&
        emptyChannelGroupList &&
        emptyChannelGroupList.map((group, groupIdx) => (
          <div key={groupIdx} className={styles.emptyGroupWrap}>
            <div
              className={clsx(
                'mb-[16px]',
                styles.emptyGroupTitle,
                isDark ? 'text-pixelsDivider' : 'text-neutralSecondary',
              )}>
              {group.title}
            </div>
            {group?.banner && group.banner.length
              ? group.banner.map((banner, index) => {
                  return <Banner banner={banner} key={index} theme={theme} />;
                })
              : null}
            {group?.introduction ? <Introduction {...group.introduction} theme={theme} /> : null}
            {group?.list && (
              <Row gutter={[16, 16]}>
                {group.list.map((channel, channelIdx) => (
                  <Col span={isLG ? 24 : 12} key={channelIdx} onClick={() => onChannelClick(channel.link)}>
                    <div
                      className={clsx(
                        'border border-solid flex items-start p-[12px] cursor-pointer',
                        isDark
                          ? 'border-pixelsBorder rounded-none bg-pixelsModalBg'
                          : 'border-neutralDivider rounded-[16px]',
                      )}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={clsx('w-[32px] h-[32px] mr-[8px]', isDark ? 'rounded-none' : 'rounded-lg')}
                        src={channel.imgUrl || ''}
                        alt=""
                      />
                      <div className={clsx('h-full flex items-center')}>
                        <div className="flex-1 flex h-full items-start flex-col">
                          <div
                            className={clsx(
                              'text-sm font-medium',
                              isDark ? 'text-pixelsBorder' : 'text-neutralPrimary',
                            )}>
                            {channel.title || ''}
                          </div>
                          <Ellipsis
                            className={clsx('text-xs', isDark ? 'text-pixelsDivider' : 'text-neutralSecondary')}
                            rows={2}
                            direction="end"
                            expandText={null}
                            collapseText={null}
                            content={channel.description || ''}
                          />
                        </div>
                        <ArrowSVG className={clsx('ml-[12px] scale-75')} />
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        ))}

      {isChannelShow && gitBookDescription && (
        <div className="text-base mt-[24px]">
          <span className={clsx('font-medium', isDark ? 'text-pixelsBorder' : 'text-neutralPrimary')}>
            {gitBookDescription}{' '}
          </span>
          <a
            className={clsx('font-medium', isDark ? 'text-pixelsPrimaryTextPurple' : 'text-brandDefault')}
            href={gitBookLink}
            target="_blank"
            rel="noreferrer">
            GitBook
          </a>
          <span className={clsx('font-medium', isDark ? 'text-pixelsBorder' : 'text-neutralPrimary')}>.</span>
        </div>
      )}
    </div>
  );
};
