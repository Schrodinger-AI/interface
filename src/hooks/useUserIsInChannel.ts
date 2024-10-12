import { useCallback } from 'react';
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

  const getUserChannelStatus = useCallback(async () => {
    if (!isInTelegram() || !token || !userId || !chatId) return true;
    try {
      const data = await fetchChatMember(token, { chat_id: chatId, user_id: userId });
      if (data?.ok && data?.result?.status === 'left') {
        router.push('/tg-join-channel');
        return false;
      }
      return true;
    } catch (error) {
      /* empty */
      return true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInTelegram, token, userId, chatId]);

  return {
    getUserChannelStatus,
  };
}
