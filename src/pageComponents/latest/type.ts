import { TBaseSGRToken } from 'types/tokens';

export const mockItemData: TBaseSGRToken = {
  tick: '',
  symbol: 'SGR-9GEN111111111',
  tokenName: 'SGR-345678901233455qwertyuiolkjhgfdsa',
  inscriptionImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  amount: '1111111',
  generation: 1,
  blockTime: 12121212122,
  decimals: 8,
  inscriptionInfo: '',
  address: '2FX4TxcfUbv8bUHDnS4LKWBG2FWEqQWuoazqoty9SvQEF1wW5w',
};

export function gerMockData(num: number) {
  return new Array(num).fill(mockItemData);
}
