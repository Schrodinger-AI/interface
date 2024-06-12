import { ZERO } from './misc';

export const appName = 'schrodinger';

export const currentRpcUrl = {
  AELF: 'rpcUrlAELF',
  tDVW: 'rpcUrlTDVW',
  tDVV: 'rpcUrlTDVV',
};

export const CONTRACT_AMOUNT = '1000000000000000000';

const env = process.env.NEXT_PUBLIC_APP_ENV;

export const PrimaryDomainName = env === 'test' ? 'https://schrodingerai.com' : 'https://schrodingernft.ai';

export const MAIN_DOMAIN = ['schrodingerai.com', 'schrodingernft.ai', 'catnft.ai'];

export const ADOPT_NEXT_RATE = ZERO.plus(0.95);
export const DIRECT_ADOPT_GEN9_RATE = ZERO.plus(0.5);
