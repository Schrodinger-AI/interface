import { ChainId } from '@portkey/types';
import { TSGRToken } from 'types/tokens';

export interface ITokenListParams {
  chainId: ChainId;
  caHash?: string;
  address: string;
  traits?: { traitType: string; value: string }[];
  generations?: number[];
  skipCount?: number;
  maxResultCount?: number;
  keyword?: string;
}

export interface ITokenListRes {
  data: TSGRToken[];
  totalCount: number;
}
