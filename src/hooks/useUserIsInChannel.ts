import { useCallback, useEffect } from 'react';
import useTelegram from './useTelegram';
import { useCmsInfo } from 'redux/hooks';
import { fetchChatMember } from 'api/request';
import { useRouter } from 'next/navigation';

export default function useUserIsInChannel() {
  const router = useRouter();
  const { isInTelegram, getTgUserId } = useTelegram();
  const cmsInfo = useCmsInfo();
  const userId = getTgUserId();
  const token = cmsInfo?.telegramBotToken;
  const chatId = cmsInfo?.telegramBotChatId;

  const getUser = useCallback(async () => {
    if (!token || !userId || !chatId) return;
    try {
      const data = await fetchChatMember(token, { chat_id: chatId, user_id: userId });
      if (data?.ok && data?.result?.status === 'left') {
        router.push('/tg-join-channel');
      }
    } catch (error) {
      /* empty */
    }
  }, [token, userId, chatId]);

  useEffect(() => {
    if (isInTelegram()) {
      getUser();
    }
  }, [getUser, isInTelegram]);

  return {
    isInTelegram,
  };
}
