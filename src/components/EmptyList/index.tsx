import clsx from 'clsx';
import styles from './index.module.css';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';
import { useCmsInfo } from 'redux/hooks';
import { useCallback, useMemo } from 'react';
import { ReactComponent as ArrowSVG } from 'assets/img/icons/arrow.svg';
import { TEmptyChannelGroup } from 'types/misc';

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

  const descriptionList = useMemo(() => {
    if (!isChannelShow) return [defaultDescription];
    const descriptionStr = cmsInfo?.emptyChannelGroupDescription || '';
    try {
      const list = JSON.parse(descriptionStr);
      if (Array.isArray(list)) return list;
    } catch (error) {
      console.log('error', error);
    }
    return [];
  }, [cmsInfo?.emptyChannelGroupDescription, defaultDescription, isChannelShow]);

  const gitBookDescription = useMemo(() => cmsInfo?.gitBookDescription || '', [cmsInfo?.gitBookDescription]);
  const gitBookLink = useMemo(() => cmsInfo?.gitBookLink || '', [cmsInfo?.gitBookLink]);

  const onChannelClick = useCallback((url: string) => {
    if (!url) return;
    window.open(url, '_blank');
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
