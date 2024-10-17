/* eslint-disable @next/next/no-img-element */
import { Flex } from 'antd';
import { useCmsInfo } from 'redux/hooks';
import styles from './style.module.css';
import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';

export default function TgWeeklyActivityRules() {
  const { tgWeeklyActivityRulesText } = useCmsInfo() || {};

  return (
    <section className={clsx('max-w-[2560px] w-full min-h-screen px-4 py-6', styles.rulesPageContainer)}>
      <BackCom title="Weekly Rank Rules" theme="dark" />
      <Flex className="mt-4 text-sm font-normal text-pixelsWhiteBg" vertical gap={20}>
        {tgWeeklyActivityRulesText?.map((item, index) => {
          return (
            <Flex key={index} vertical gap={8}>
              <h3 className="text-lg font-semibold text-functionalYellowSub">{item?.title}</h3>
              {typeof item?.content === 'string' ? (
                <p>{item?.content}</p>
              ) : (
                <ul className="list-inside list-none text-neutralSecondary">
                  {item.content.map((text) => {
                    return <li key={text}>{text}</li>;
                  })}
                </ul>
              )}
            </Flex>
          );
        })}
      </Flex>
    </section>
  );
}
