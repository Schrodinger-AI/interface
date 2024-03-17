import { useWebLogin } from 'aelf-web-login';
import BigNumber from 'bignumber.js';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { canUseWhenNoStart } from 'redux/utils';

const hiddenPath = ['/', '/detail', '/stray-cats', '/latest'];

export function useRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const cmsInfo = useCmsInfo();
  const { wallet } = useWebLogin();

  const redirect = (openTimeStamp: string, pathName: string) => {
    if (canUseWhenNoStart(wallet.address)) return false;

    if (hiddenPath.includes(pathName)) {
      const currentTime = new Date().getTime();
      if (BigNumber(openTimeStamp || 0).gt(currentTime)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!cmsInfo?.openTimeStamp) return;
    if (redirect(cmsInfo?.openTimeStamp, pathname)) {
      router.replace('/coundown');
    }
  }, [cmsInfo?.openTimeStamp, pathname, router]);
}
