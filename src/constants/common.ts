import { ENVIRONMENT } from './url';

export const appName = 'schrodinger';

export const currentRpcUrl = {
  AELF: 'rpcUrlAELF',
  tDVW: 'rpcUrlTDVW',
  tDVV: 'rpcUrlTDVV',
};

export const CONTRACT_AMOUNT = '1000000000000000000';

const env = process.env.NEXT_PUBLIC_APP_ENV;

export const PrimaryDomainName =
  env === ENVIRONMENT.TEST ? 'https://app.schrodingerai.com' : 'https://app.schrodingernft.ai';

export const MAIN_DOMAIN = [
  'schrodingerai.com',
  'schrodingernft.ai',
  'app.schrodingernft.ai',
  'app.schrodingerai.com',
  'catnft.ai',
  'localhost',
];
