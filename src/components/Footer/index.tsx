import clsx from 'clsx';
import styles from './style.module.css';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useResponsive } from 'hooks/useResponsive';
import useGetCustomTheme from 'redux/hooks/useGetCustomTheme';

export default function Footer({ className }: { className?: string }) {
  const pathName = usePathname();
  const customTheme = useGetCustomTheme();

  const { isLG } = useResponsive();

  const showMargin = useMemo(() => {
    if (!isLG) return false;
    const path = pathName?.split('/')?.[1];
    return ['detail', ''].includes(path);
  }, [isLG, pathName]);

  return (
    <section
      className={clsx('flex-shrink-0', showMargin ? 'mb-[80px]' : 'mb-0', styles[customTheme.footer.theme], className)}>
      <div className={`${styles.footer}`}>
        <span className={styles['footer-text']}>Schrödinger@2024</span>
      </div>
    </section>
  );
}
