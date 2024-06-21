import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { NEED_LOGIN_PAGE } from 'constants/router';
import { ListTypeEnum } from 'types';

const useBackToHomeByRoute = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const backToHomeByRoute = useCallback(() => {
    try {
      const firstPathName = '/' + pathname.split('/')[1];
      if (NEED_LOGIN_PAGE.includes(firstPathName)) {
        router.push('/');
      } else if (pathname === '/' && Number(searchParams.get('pageState')) === ListTypeEnum.My) {
        router.push('/');
      }
    } catch (e) {
      console.log(e);
    }
  }, [pathname, router, searchParams]);

  return backToHomeByRoute;
};

export default useBackToHomeByRoute;
