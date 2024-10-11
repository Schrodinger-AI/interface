/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import styles from './style.module.css';
import { ReactComponent as TgLogoSVG } from 'assets/img/telegram/telegram_logo.svg';
import { Flex } from 'antd';
import Link from 'next/link';
import { fetchChatMember } from 'api/request';
import { useCmsInfo } from 'redux/hooks';
import { useState } from 'react';
import useTelegram from 'hooks/useTelegram';
import throttle from 'lodash-es/throttle';

function TgJoinChannel() {
  const [isShaking, setIsShaking] = useState(false);
  const cmsInfo = useCmsInfo();
  const { getTgUserId } = useTelegram();
  const userId = getTgUserId();
  const token = cmsInfo?.telegramBotToken;
  const chatId = cmsInfo?.telegramBotChatId;

  const handleVerify = throttle(
    async () => {
      if (!token || !userId || !chatId) return;
      try {
        const data = await fetchChatMember(token, { chat_id: chatId, user_id: userId });
        if (data?.ok && data?.result?.status === 'member') {
          window.location.href = `/telegram/home`;
        } else {
          setIsShaking(true);

          setTimeout(() => {
            setIsShaking(false);
          }, 500);
        }
      } catch (error) {
        /* empty */
      }
    },
    700,
    { trailing: false },
  );

  return (
    <div className={clsx(styles['channel-container'], 'w-full h-full relative')}>
      <img src={require('assets/img/telegram/channel/header.png').default.src} alt="" className="w-[100vw] h-auto" />
      <Flex
        align="center"
        justify="space-between"
        className={clsx(
          isShaking ? styles['shake'] : '',
          'shadow-floatingButtonsShadow bg-floatingButtonsBg mt-8 mx-[16px] px-[16px] h-[64px] rounded-[8px]',
        )}>
        <Flex className={clsx(styles['channel-title'])} align="center">
          <TgLogoSVG className="w-[32px] h-[32px] mr-[12px]" />
          <span className="text-white font-semibold text-[18px] leading-[26px]">Join Our Channel</span>
        </Flex>

        <Link href="https://t.me/schrodingerann">
          <button className={clsx(styles['channel-button'], '!w-[64px] !h-[32px]')}></button>
        </Link>
      </Flex>

      <Flex align="center" justify="center" className="mt-12">
        <button className={clsx(styles['verify-button'], '!w-[124px] !h-[48px]')} onClick={handleVerify}></button>
      </Flex>
    </div>
  );
}

export default TgJoinChannel;
