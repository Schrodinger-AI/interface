/* eslint-disable @next/next/no-img-element */
import { Flex } from 'antd';
import { useCmsInfo } from 'redux/hooks';
import styles from './style.module.css';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';

export default function RulesPage() {
  const { tgRulesText, twitterUrlInTgRules } = useCmsInfo() || {};

  return (
    <section className={clsx('max-w-[2560px] w-full min-h-screen px-4 py-6', styles.rulesPageContainer)}>
      <BackCom className="w-full" theme="dark" />
      <img
        src={require('assets/img/telegram/rules-text.png').default.src}
        alt=""
        className="w-[66px] h-9 object-contain mt-4"
      />
      <Flex className="mt-4 text-sm font-normal text-pixelsWhiteBg" vertical gap={20}>
        {tgRulesText?.map((item, index) => {
          return (
            <Flex key={index} vertical gap={8}>
              <h3 className="text-lg font-semibold text-pixelsTertiaryTextPurple">{item?.title}</h3>
              {typeof item?.content === 'string' ? (
                <p>{item?.content}</p>
              ) : (
                <ul className="list-inside list-none">
                  {item.content.map((text, index) => {
                    return <li key={text}>{text}</li>;
                  })}
                </ul>
              )}
            </Flex>
          );
        })}
      </Flex>
      <Flex vertical gap={8} className="text-sm font-normal text-pixelsWhiteBg mt-5">
        <p>The rarer the cat, the higher the $SGR we offer! More info here:</p>
        <a
          href={twitterUrlInTgRules}
          target="_blank"
          rel="noreferrer"
          className="text-pixelsPrimaryTextPink hover:text-pixelsPrimaryTextPink break-all">
          {twitterUrlInTgRules}
        </a>
      </Flex>
    </section>
  );
}
