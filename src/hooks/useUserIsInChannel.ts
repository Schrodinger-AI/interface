import { useCallback, useState } from 'react';
import useTelegram from './useTelegram';
import { useCmsInfo } from 'redux/hooks';
import { fetchChatMember } from 'api/request';

export default function useUserIsInChannel() {
  const { isInTelegram, getTgUserId } = useTelegram();
  const cmsInfo = useCmsInfo();
  const userId = getTgUserId();
  const token = cmsInfo?.telegramBotToken;
  const chatId = cmsInfo?.telegramBotChatId;

  const [isJoined, setIsJoined] = useState(true);

  const getUserChannelStatus = useCallback(async () => {
    if (!isInTelegram() || !token || !userId || !chatId) return true;
    try {
      const data = await fetchChatMember(token, { chat_id: chatId, user_id: userId });
      if (data?.ok && data?.result?.status === 'left') {
        setIsJoined(false);
        return false;
      }
      return true;
    } catch (error) {
      /* empty */
      return true;
    }
  }, [isInTelegram, token, userId, chatId]);

  return {
    getUserChannelStatus,
    isJoined,
  };
}
