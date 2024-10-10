import { useCallback, useMemo } from 'react';
import { TelegramPlatform } from '@portkey/did-ui-react';

export default function useTelegram() {
  const isInTelegram = useCallback(() => {
    return !TelegramPlatform.isTelegramPlatform();
  }, []);

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  return {
    isInTelegram,
    isInTG,
  };
}
