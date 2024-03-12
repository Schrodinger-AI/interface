import clsx from 'clsx';
import styles from './index.module.css';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';
import { useCmsInfo } from 'redux/hooks';
import { useCallback, useMemo } from 'react';
import { ReactComponent as ArrowSVG } from 'assets/img/icons/arrow.svg';
import { TEmptyChannelGroup } from 'types/misc';

export interface IEmptyListProps {
  isChannelShow?: boolean;
  className?: string;
}

export const EmptyList = ({ isChannelShow = false, className }: IEmptyListProps) => {
  const cmsInfo = useCmsInfo();

  const emptyChannelGroupList = useMemo(() => {
    return JSON.parse(cmsInfo?.emptyChannelGroupList || '{}') as TEmptyChannelGroup[];
  }, [cmsInfo?.emptyChannelGroupList]);

  const emptyChannelGroupDescription = useMemo(() => {
    return cmsInfo?.emptyChannelGroupDescription || '';
  }, [cmsInfo?.emptyChannelGroupDescription]);

  const onChannelClick = useCallback((url: string) => {
    if (!url) return;
    window.open(url, '_blank');
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
