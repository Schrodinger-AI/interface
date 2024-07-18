import { openExternalLink } from 'utils/openlink';
import { useCheckLoginAndToken } from './useWallet';
import { NEED_LOGIN_PAGE } from 'constants/router';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useRouter } from 'next/navigation';

export const useJumpToPage = () => {
  const { checkLogin } = useCheckLoginAndToken();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();

  const jumpToPage = ({ link, linkType, needLogin }: { link?: string; linkType?: TLinkType; needLogin?: boolean }) => {
    if (!link) return;
    switch (linkType) {
      case 'externalLink':
        openExternalLink(link, '_blank');
        break;
      case 'link':
        if (NEED_LOGIN_PAGE.includes(link) || needLogin) {
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
  };
  return { jumpToPage };
};
