import NoticeScrollList from 'components/NoticeScrollList';
import clsx from 'clsx';
import styles from './styles.module.css';
import MobileBackNav from 'components/MobileBackNav';

export default function EventList() {
  return (
    <div className={clsx('w-full overflow-hidden', styles['event-container'])}>
      <MobileBackNav />
      <div className="text-neutralTitle text-2xl font-semibold">Event</div>
      <NoticeScrollList useInfiniteScroll={false} />
    </div>
  );
}
