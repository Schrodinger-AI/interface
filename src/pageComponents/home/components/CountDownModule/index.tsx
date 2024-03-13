import { useEffect } from 'react';
import styles from './style.module.css';
import useCountdown from 'pageComponents/home/hooks/useCountDown';
import { useRouter } from 'next/navigation';

export default function CountDownModule({ targetDate }: { targetDate: string }) {
  const { hours, minutes, seconds, days, end } = useCountdown(targetDate);

  const router = useRouter();

  useEffect(() => {
    if (end) {
      router.replace('/tokens');
    }
  }, [end, router]);

  return (
    <div className="flex gap-[4px] items-center">
      <span className={styles.timeText}>{days}</span>
      <span className={styles.timeType}>D</span>
      <span className={styles.timeText}>{hours}</span>
      <span className={styles.timeType}>H</span>
      <span className={styles.timeText}>{minutes}</span>
      <span className={styles.timeType}>M</span>
      <span className={styles.timeText}>{seconds}</span>
      <span className={styles.timeType}>S</span>
    </div>
  );
}
