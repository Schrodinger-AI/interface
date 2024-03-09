import BN, { isBN } from 'bn.js';
export function zeroFill(str: string | BN) {
  return isBN(str) ? str.toString(16, 64) : str.padStart(64, '0');
}

export const getPageNumber = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize;
};
