import { ENVIRONMENT } from './url';
import { ZERO } from './misc';

export const appName = 'schrodinger';

export const currentRpcUrl = {
  AELF: 'rpcUrlAELF',
  tDVW: 'rpcUrlTDVW',
  tDVV: 'rpcUrlTDVV',
};

export const CONTRACT_AMOUNT = '1000000000000000000';

const env = process.env.NEXT_PUBLIC_APP_ENV;

export const PrimaryDomainName =
  env === ENVIRONMENT.TEST ? 'https://cat.schrodingerai.com' : 'https://cat.schrodingernft.ai';

export const MAIN_DOMAIN = [
  'schrodingerai.com',
  'schrodingernft.ai',
  'cat.schrodingernft.ai',
  'cat.schrodingerai.com',
  'catnft.ai',
  'localhost',
];

export const ADOPT_NEXT_RATE = ZERO.plus(0.95);
export const DIRECT_ADOPT_GEN9_RATE = ZERO.plus(0.625);
export const DIRECT_ADOPT_GEN9_MIN = 1.6;
export const ADOPT_NEXT_MIN = 1.0527;
