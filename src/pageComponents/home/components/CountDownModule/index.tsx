import { useCountDown } from 'ahooks';
import styles from './style.module.css';
import dayjs from 'dayjs';

export default function CountDownModule({ targetDate }: { targetDate: string }) {
  const [countdown, formattedRes] = useCountDown({
    targetDate: dayjs(Number(targetDate)).format('YYYY-MM-DD'),
  });
  return (
    <div className="flex gap-[4px] items-center">
      <span className={styles.timeText}>{formattedRes.days}</span>
      <span className={styles.timeType}>D</span>
      <span className={styles.timeText}>{formattedRes.hours}</span>
      <span className={styles.timeType}>H</span>
      <span className={styles.timeText}>{formattedRes.minutes}</span>
      <span className={styles.timeType}>M</span>
      <span className={styles.timeText}>{formattedRes.seconds}</span>
      <span className={styles.timeType}>S</span>
    </div>
  );
}
