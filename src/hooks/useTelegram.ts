import { useCallback, useMemo } from 'react';
import { TelegramPlatform } from '@portkey/did-ui-react';
import { isInTelegram } from 'utils/isInTelegram';

export default function useTelegram() {
  const isInTG = useMemo(() => {
    return isInTelegram();
  }, []);

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
