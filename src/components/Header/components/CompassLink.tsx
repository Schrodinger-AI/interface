import { ICompassProps, RouterItemType } from '../type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import TagNewIcon from 'assets/img/event/tag-new-square.png';
import styles from '../style.module.css';
import clsx from 'clsx';
import Image from 'next/image';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';

export const CompassText = (props: { title?: string; schema?: string; icon?: string }) => {
  const pathname = usePathname();
  const isCurrent = pathname?.toLocaleLowerCase() === props.schema?.toLowerCase();

  return (
    <span
      className={clsx(
        styles['header-menu'],
        `!rounded-[12px] text-lg flex items-center ${
          isCurrent ? '!text-brandDefault' : ''
        } hover:text-brandHover cursor-pointer font-medium`,
      )}>
      {props.icon ? <img src={props.icon} alt="logo" className="mr-[8px] w-[18px] h-[18px]" /> : null}
      <span>{props.title}</span>
    </span>
  );
};

export interface ICompassLinkProps {
  item: ICompassProps;
  className?: string;
  onPressCompassItems?: (item: ICompassProps) => void;
}

export const CompassLink = ({ item, className, onPressCompassItems }: ICompassLinkProps) => {
  const { schema, type, title } = item;
  const isOut = type === RouterItemType.Out || !type;

  const { hasNewActivities } = useGetStoreInfo();

  const renderCom = <CompassText title={title} schema={schema} icon={item.icon} />;
  const onPress = useCallback(
    (event: any) => {
      event.preventDefault();
      onPressCompassItems && onPressCompassItems(item);
    },
    [item, onPressCompassItems],
  );

  return isOut ? (
    <Link className={className} href={schema || ''} scroll={false}>
      {renderCom}
    </Link>
  ) : (
    <span className={clsx('relative', className)} onClick={onPress}>
      {renderCom}
      {type === RouterItemType.EventList && hasNewActivities ? (
        <Image alt="new" src={TagNewIcon} width={32} height={16} className="absolute -top-[14px] -right-[8px] z-10" />
      ) : null}
    </span>
  );
};
