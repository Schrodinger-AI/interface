import { useEffect, useRef, useState } from 'react';
const MILLISECOND_CONVERT_SECOND = 1000;
const SECOND_CONVERT_HOUR = 60 * 60;

export default function useCountdown(targetTime: string) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [days, setDays] = useState(0);

  const interval = useRef<number | null>(null);

  useEffect(() => {
    interval.current = window.setInterval(() => {
      const { hours, minutes, seconds, days } = getCountDown(targetTime || 0);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
      setDays(days);
    }, 1000);
    return () => {
      interval.current && window.clearInterval(interval.current);
    };
  }, [targetTime]);
  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function getCountDown(targetTime: number | string) {
  const now = new Date().getTime();

  // now = convertToUtcTimestamp(now);

  const timeDiff = Number(targetTime) - now;

  const seconds = Math.floor(timeDiff / MILLISECOND_CONVERT_SECOND);

  const days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);

  let hours = Math.floor(seconds / SECOND_CONVERT_HOUR);

  const minutes = Math.floor((seconds % SECOND_CONVERT_HOUR) / 60);
  const remainingSeconds = seconds % 60;

  if (hours >= 24) {
    hours = hours % 24;
  }

  return {
    days,
    hours: hours,
    minutes: minutes,
    seconds: remainingSeconds,
  };
}

export function convertToUtcTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60 * MILLISECOND_CONVERT_SECOND;

  const utcTimestamp = timestamp + offset;
  return utcTimestamp;
}
