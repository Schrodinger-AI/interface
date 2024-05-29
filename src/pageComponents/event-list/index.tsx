import clsx from 'clsx';
import styles from './styles.module.css';
import MobileBackNav from 'components/MobileBackNav';
import EventScrollList from 'components/EventScrollList';

export default function EventList() {
  return (
    <div className={clsx('w-full overflow-hidden', styles['event-container'])}>
      <MobileBackNav />
      <div className="text-neutralTitle text-2xl font-semibold mb-[16px]">Events</div>
      <EventScrollList />
    </div>
  );
}
