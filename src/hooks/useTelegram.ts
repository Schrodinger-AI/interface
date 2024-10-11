import { useCallback, useMemo } from 'react';
import { TelegramPlatform } from '@portkey/did-ui-react';

export default function useTelegram() {
  const isInTelegram = useCallback(() => {
    if (typeof window !== 'undefined') {
      return TelegramPlatform.isTelegramPlatform();
    }
    return false;
  }, []);

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  const getTgUserId = useCallback(() => {
    if (typeof window !== 'undefined') {
      return isInTG ? TelegramPlatform.getTelegramUserId() : null;
    }
    return null;
  }, [isInTG]);

  return {
    isInTelegram,
    isInTG,
    getTgUserId,
  };
}
