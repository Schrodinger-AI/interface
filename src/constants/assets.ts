import { TBaseTokenInfo } from 'types';

export const DEFAULT_TX_FEE = {
  common: 0.0031,
};

export const PRICE_QUOTE_COIN = 'USD';

export enum TokenType {
  ELF = 'ELF',
}

export const AELF_TOKEN_INFO: TBaseTokenInfo = {
  symbol: TokenType.ELF,
  decimals: 8,
};
export const DEFAULT_TOKEN_INFO = AELF_TOKEN_INFO;
export const DEFAULT_TOKEN_SYMBOL = DEFAULT_TOKEN_INFO.symbol;
export const DEFAULT_TOKEN_DECIMALS = DEFAULT_TOKEN_INFO.decimals;

export const ETRANSFER_TOKEN_KEY = 'etransfer_access_token';

export const POINTS_COEFFICIENT = {
  'XPSGR-5': 1314,
  'XPSGR-5-Direct': 9666,
};
