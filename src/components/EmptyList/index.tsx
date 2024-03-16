import clsx from 'clsx';
import styles from './index.module.css';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';
import { useCmsInfo } from 'redux/hooks';
import { useCallback, useMemo } from 'react';
import { ReactComponent as ArrowSVG } from 'assets/img/icons/arrow.svg';
import { TEmptyChannelGroup } from 'types/misc';
import { openExternalLink } from 'utils/openlink';

export interface IEmptyListProps {
  isChannelShow?: boolean;
  defaultDescription?: string;
  className?: string;
}

export const EmptyList = ({ isChannelShow = false, defaultDescription = '', className }: IEmptyListProps) => {
  const cmsInfo = useCmsInfo();

  const emptyChannelGroupList = useMemo(() => {
    try {
      return JSON.parse(cmsInfo?.emptyChannelGroupList || '[]') as TEmptyChannelGroup[];
    } catch (error) {
      return [];
    }
  }, [cmsInfo?.emptyChannelGroupList]);

  const emptyChannelGroupDescription = useMemo(() => {
    return isChannelShow ? cmsInfo?.emptyChannelGroupDescription : defaultDescription;
  }, [cmsInfo?.emptyChannelGroupDescription, defaultDescription, isChannelShow]);

  const onChannelClick = useCallback((url: string) => {
    if (!url) return;
    openExternalLink(url, '_blank');
  }, []);

  return (
    <div className={clsx([styles.emptyListWrap, className])}>
      <ArchiveSVG className={styles.emptyImg} />

      <div className={styles.emptyTips}>{emptyChannelGroupDescription}</div>

      {isChannelShow &&
        emptyChannelGroupList &&
        emptyChannelGroupList.map((group, groupIdx) => (
          <div key={groupIdx} className={styles.emptyGroupWrap}>
            <div className={styles.emptyGroupTitle}>{`${groupIdx + 1}. ${group.title}`}</div>
            {group.list &&
              group.list.map((channel, channelIdx) => (
                <div key={channelIdx} className={styles.channelWrap} onClick={() => onChannelClick(channel.link)}>
                  <img className={styles.channelImg} src={channel.imgUrl || ''} alt="" />
                  <div className={styles.channelContent}>
                    <div className={styles.channelTitle}>{channel.title || ''}</div>
                    <div className={styles.channelDescription}>{channel.description || ''}</div>
                  </div>
                  <ArrowSVG className={styles.arrowWrap} />
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};
