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

export enum ENVIRONMENT {
  TEST = 'test',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

const explorerUrls = {
  [ENVIRONMENT.TEST]: {
    AELF: 'https://testnet.aelfscan.io/',
    TDVV: 'https://testnet.aelfscan.io/tDVW/',
    TDVW: 'https://testnet.aelfscan.io/tDVW/',
  },
  [ENVIRONMENT.DEVELOPMENT]: {
    AELF: 'https://aelfscan.io/',
    TDVV: 'https://aelfscan.io/tDVV/',
    TDVW: 'https://aelfscan.io/tDVV/',
  },
  [ENVIRONMENT.PRODUCTION]: {
    AELF: 'https://aelfscan.io/',
    TDVV: 'https://aelfscan.io/tDVV/',
    TDVW: 'https://aelfscan.io/tDVV/',
  },
};

export const EXPLORE_URL = {
  AELF: explorerUrls[env].AELF,
  TDVV: explorerUrls[env].TDVV,
  TDVW: explorerUrls[env].TDVW,
};

export const etransferDomain = 'https://etransfer';
