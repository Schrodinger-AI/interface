import { SupportedELFChainId } from 'types';
import { cmsInfo } from '../../mock';

export const getRpcUrls = () => {
  // const info = store.getState().aelfInfo.aelfInfo;
  const info = cmsInfo;

  return {
    [SupportedELFChainId.MAIN_NET]: info?.rpcUrlAELF,
    [SupportedELFChainId.TDVV_NET]: info?.rpcUrlTDVV,
    [SupportedELFChainId.TDVW_NET]: info?.rpcUrlTDVW,
  };
};
