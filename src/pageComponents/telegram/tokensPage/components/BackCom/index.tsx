import { Flex } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function BackCom({ className, url, theme }: { className?: string; url?: string; theme?: TModalTheme }) {
  const router = useRouter();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  return (
    <Flex
      align="center"
      gap={8}
      className={clsx('w-fit cursor-pointer', className)}
      onClick={() => {
        if (url) {
          router.replace(url);
          return;
        }
        router.back();
      }}>
      <ArrowSVG className={clsx('size-4', { ['common-revert-90']: true }, { ['text-pixelsWhiteBg']: isDark })} />
      <span className={clsx('font-semibold text-sm', isDark && 'text-pixelsWhiteBg')}>Back</span>
    </Flex>
  );
}
