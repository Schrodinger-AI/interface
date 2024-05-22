import clsx from 'clsx';
import styles from './index.module.css';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';
import { useCmsInfo } from 'redux/hooks';
import { useCallback, useMemo } from 'react';
import { ReactComponent as ArrowSVG } from 'assets/img/icons/arrow.svg';
import { openExternalLink } from 'utils/openlink';
import Banner from './components/Banner';
import Introduction from './components/Introduction';
import { Col, Row } from 'antd';
import useResponsive from 'hooks/useResponsive';
import { Ellipsis } from 'antd-mobile';

export interface IEmptyListProps {
  isChannelShow?: boolean;
  defaultDescription?: string;
  className?: string;
}

export const EmptyList = ({ isChannelShow = false, defaultDescription = '', className }: IEmptyListProps) => {
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

  const onChannelClick = useCallback((url: string) => {
    if (!url) return;
    openExternalLink(url, '_blank');
  }, []);

  return (
    <div className={clsx([styles.emptyListWrap, className])}>
      <ArchiveSVG className={styles.emptyImg} />

      <div className="flex flex-col items-start pt-[8px]">
        {descriptionList.map((item, idx) => (
          <div key={idx} className={styles.emptyTips}>
            {item}
          </div>
        ))}
      </div>

      {isChannelShow &&
        emptyChannelGroupList &&
        emptyChannelGroupList.map((group, groupIdx) => (
          <div key={groupIdx} className={styles.emptyGroupWrap}>
            <div className={clsx('mb-[16px]', styles.emptyGroupTitle)}>{group.title}</div>
            {group?.banner && group.banner.length
              ? group.banner.map((banner, index) => {
                  return <Banner banner={banner} key={index} />;
                })
              : null}
            {group?.introduction ? <Introduction {...group.introduction} /> : null}
            {group?.list && (
              <Row gutter={[16, 16]}>
                {group.list.map((channel, channelIdx) => (
                  <Col span={isLG ? 24 : 12} key={channelIdx} onClick={() => onChannelClick(channel.link)}>
                    <div
                      className={clsx(
                        'border border-solid border-neutralDivider rounded-[16px] flex items-start p-[12px] cursor-pointer',
                      )}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={clsx('w-[32px] h-[32px] rounded-lg mr-[8px]')}
                        src={channel.imgUrl || ''}
                        alt=""
                      />
                      <div className={clsx('h-full flex items-center')}>
                        <div className="flex-1 flex h-full items-start flex-col">
                          <div className={clsx('text-neutralPrimary text-sm font-medium')}>{channel.title || ''}</div>
                          <Ellipsis
                            className={clsx('text-neutralSecondary text-xs')}
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
          <span className="text-neutralPrimary font-medium">{gitBookDescription} </span>
          <a className="text-brandDefault font-medium" href={gitBookLink} target="_blank" rel="noreferrer">
            GitBook
          </a>
          <span className="text-neutralPrimary font-medium">.</span>
        </div>
      )}
    </div>
  );
};
