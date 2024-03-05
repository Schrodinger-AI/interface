import { SupportedELFChainId } from 'types';
import { store } from 'redux/store';

export const getRpcUrls = () => {
  // const info = store.getState().aelfInfo.aelfInfo;
  const info = store.getState().info.cmsInfo;

  return {
    [SupportedELFChainId.MAIN_NET]: info?.rpcUrlAELF,
    [SupportedELFChainId.TDVV_NET]: info?.rpcUrlTDVV,
    [SupportedELFChainId.TDVW_NET]: info?.rpcUrlTDVW,
  };
};
