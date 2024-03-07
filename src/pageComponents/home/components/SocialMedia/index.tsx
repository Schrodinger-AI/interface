import { ReactComponent as DisCord } from 'assets/img/social/discord.svg';
import { ReactComponent as GitBook } from 'assets/img/social/gitbook.svg';
import { ReactComponent as LinkTree } from 'assets/img/social/linktree.svg';
import { ReactComponent as Telegram } from 'assets/img/social/telegram.svg';
import { ReactComponent as Twitter } from 'assets/img/social/twitter.svg';
import { ReactComponent as DisCordMobile } from 'assets/img/social/discord-s.svg';
import { ReactComponent as GitBookMobile } from 'assets/img/social/gitbook-s.svg';
import { ReactComponent as LinkTreeMobile } from 'assets/img/social/linktree-s.svg';
import { ReactComponent as TelegramMobile } from 'assets/img/social/telegram-s.svg';
import { ReactComponent as TwitterMobile } from 'assets/img/social/twitter-s.svg';
import styles from './index.module.css';
import { useResponsive } from 'ahooks';

export interface SocialMediaProps {
  data: Array<SocialMediaItem>;
}

export interface SocialMediaItem {
  index?: number;
  icon?: string;
  link?: string;
  target?: string;
  name: string;
}

export default function SocialMedia({ data }: SocialMediaProps) {
  const responsive = useResponsive();

  const socialMediaIcons: Record<string, any> = {
    discord: responsive.md ? DisCord : DisCordMobile,
    gitbook: responsive.md ? GitBook : GitBookMobile,
    linktree: responsive.md ? LinkTree : LinkTreeMobile,
    telegram: responsive.md ? Telegram : TelegramMobile,
    twitter: responsive.md ? Twitter : TwitterMobile,
  };

  const getMediaItem = (name: string) => {
    const MediaItem = socialMediaIcons[name];
    return <MediaItem />;
  };

  return (
    <div className="flex justify-center gap-[16px]">
      {data.map((item, index) => {
        return (
          <div
            key={item.name}
            onClick={() => {
              window.open(item.link, item.target || '_blank');
            }}
            className={`${styles.icon} ${styles[item.name.toLocaleLowerCase()]}`}>
            {getMediaItem(item.name.toLocaleLowerCase())}
          </div>
        );
      })}
    </div>
  );
}
