import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { NEED_LOGIN_PAGE, TG_NEED_LOGIN_PAGE } from 'constants/router';
import { ListTypeEnum } from 'types';
import useTelegram from './useTelegram';

const useBackToHomeByRoute = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isInTelegram } = useTelegram();

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  const backToHomeByRoute = useCallback(() => {
    try {
      const firstPathName = '/' + pathname.split('/')[1];
      if ((isInTG ? TG_NEED_LOGIN_PAGE : NEED_LOGIN_PAGE).includes(firstPathName)) {
        if (isInTG) {
          router.replace('/telegram/home');
        } else {
          router.replace('/');
        }
      } else if (pathname === '/' && Number(searchParams.get('pageState')) === ListTypeEnum.My) {
        router.push('/');
      }
    } catch (e) {
      console.log(e);
    }
  }, [isInTG, pathname, router, searchParams]);

  return backToHomeByRoute;
};

export default useBackToHomeByRoute;
