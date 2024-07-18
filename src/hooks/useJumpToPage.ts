import { openExternalLink } from 'utils/openlink';
import { useCheckLoginAndToken } from './useWallet';
import { NEED_LOGIN_PAGE } from 'constants/router';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useJumpToPage = () => {
  const { checkLogin } = useCheckLoginAndToken();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();

  const jumpToPage = useCallback(
    ({ link, linkType, needLogin }: { link?: string; linkType?: TLinkType; needLogin?: boolean }) => {
      if (!link) return;
      const href = link.split('?')[0];
      switch (linkType) {
        case 'externalLink':
          openExternalLink(link, '_blank');
          break;
        case 'link':
          if (NEED_LOGIN_PAGE.includes(link) || NEED_LOGIN_PAGE.includes(href) || needLogin) {
            if (isLogin) {
              router.push(link);
            } else {
              checkLogin({
                onSuccess: () => {
                  if (!link) return;
                  router.push(link);
                },
              });
            }
          } else {
            router.push(link);
          }
          break;
      }
    },
    [checkLogin, isLogin, router],
  );
  return { jumpToPage };
};
