import { useMemo } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

enum HonourTypeEnum {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',
  Halcyon = 'Halcyon',
  Diamond = 'Diamond',
}

const stylesMap: Record<HonourTypeEnum, string> = {
  [HonourTypeEnum.Bronze]: styles.bronze,
  [HonourTypeEnum.Silver]: styles.silver,
  [HonourTypeEnum.Gold]: styles.gold,
  [HonourTypeEnum.Platinum]: styles.platinum,
  [HonourTypeEnum.Halcyon]: styles.halcyon,
  [HonourTypeEnum.Diamond]: styles.diamond,
};

export default function HonourLabel({ text }: { text: string }) {
  const style = useMemo(() => {
    for (const honourName in stylesMap) {
      if (text.includes(honourName)) {
        return stylesMap[honourName as HonourTypeEnum];
      }
    }
    return undefined;
  }, [text]);

  return (
    <div
      className={clsx(
        'px-1 py-[1px] rounded-sm bg-black opacity-60 flex justify-center items-center text-xxs font-medium border-[1px] border-solid w-fit',
        style,
      )}>
      {text}
    </div>
  );
}
