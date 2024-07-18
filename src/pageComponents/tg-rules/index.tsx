import { Flex } from 'antd';
import { useCmsInfo } from 'redux/hooks';
import { ReactComponent as ReturnSVG } from 'assets/img/telegram/return.svg';
import styles from './style.module.css';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function RulesPage() {
  const { tgRulesText, gitbookUrlInTgRules } = useCmsInfo() || {};
  const router = useRouter();

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <section className={clsx('max-w-[2560px] w-full min-h-screen px-4 py-6', styles.rulesPageContainer)}>
      <Flex align="center" gap={8} className="w-fit cursor-pointer" onClick={onBack}>
        <ReturnSVG />
        <span className="text-sm font-normal text-pixelsWhiteBg">Back</span>
      </Flex>
      <div className="mt-4 text-xl font-medium text-neutralWhiteBg stroke-[1px] stroke-pixelsCardBg">Rules</div>
      <div className="mt-2 text-xs font-normal text-pixelsTertiaryTextPurple">
        {tgRulesText?.map((item, index) => {
          return typeof item === 'string' ? (
            <p key={index} className={clsx(index === 0 && 'mb-2')}>
              {item}
            </p>
          ) : (
            <div key={index}>
              {item.map((text, i) => {
                return <p key={'' + index + i}>{'- ' + text}</p>;
              })}
            </div>
          );
        })}
      </div>
      <a
        href={gitbookUrlInTgRules}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-normal text-pixelsPrimaryTextPink hover:text-pixelsPrimaryTextPink">
        {gitbookUrlInTgRules}
      </a>
    </section>
  );
}
