import { Flex } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ReactComponent as QuestionIcon } from 'assets/img/icons/question.svg';
import Link from 'next/link';

export default function MobileBackNav({
  className,
  url,
  theme,
  title,
  tips,
}: {
  className?: string;
  url?: string;
  theme?: TModalTheme;
  title?: string;
  tips?: {
    show: boolean;
    link: string;
  };
}) {
  const router = useRouter();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  return (
    <Flex align="center" justify="space-between" className={clsx('w-fit cursor-pointer', className)}>
      <Flex
        className="w-fit"
        align="center"
        gap={8}
        onClick={() => {
          console.log('=====url', url);
          if (url) {
            router.replace(url);
            return;
          }
          router.back();
        }}>
        <ArrowSVG className={clsx('size-4', { ['common-revert-90']: true }, { ['text-pixelsWhiteBg']: isDark })} />
        <span className={clsx('font-semibold text-sm', isDark && 'text-pixelsWhiteBg')}>{title || 'Back'}</span>
      </Flex>

      {tips?.show ? (
        <Link href={tips.link}>
          <QuestionIcon className={clsx(theme === 'dark' && 'fill-pixelsWhiteBg')} />
        </Link>
      ) : null}
    </Flex>
  );
}
