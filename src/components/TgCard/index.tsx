import { PropsWithChildren, ReactNode } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';

interface ITgCardProps extends PropsWithChildren {
  className?: string;
}

function TgCard({ className, children }: ITgCardProps) {
  return (
    <div className={clsx('w-full p-[16px]', 'shadow-tgModalShadow rounded-[8px]', styles['dark-card-bg'], className)}>
      {children}
    </div>
  );
}

export default TgCard;
