import clsx from 'clsx';
import styles from './style.module.css';

export default function Footer({ className }: { className?: string }) {
  return (
    <section className={clsx('flex-shrink-0 mb-[80px] lg:mb-0', className)}>
      <div className={`${styles.footer}`}>
        <span>Schrödinger@2024</span>
      </div>
    </section>
  );
}
