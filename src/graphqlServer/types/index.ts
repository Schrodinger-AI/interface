import { ApolloQueryResult } from '@apollo/client';
import { TGraphQLClient } from './common';
import { ITrait, TBaseSGRToken, TSGRToken } from 'types/tokens';
export * from './common';

export type TCommonGraphQLResult<T> = Promise<ApolloQueryResult<T>>;

export type TGetSchrodingerListParams = {
  input: {
    chainId: string;
    address?: string;
    tick?: string;
    skipCount?: number;
    maxResultCount?: number;
    keyword?: string;
  };
};
export type TGetSchrodingerListResult = {
  getSchrodingerList: {
    totalCount: number;
    data: Array<TBaseSGRToken>;
  };
};
export type TGetSchrodingerList = (
  client: TGraphQLClient,
  params: TGetSchrodingerListParams,
) => TCommonGraphQLResult<TGetSchrodingerListResult>;

export type TGetSchrodingerDetailParams = {
  input: {
    chainId: string;
    address?: string;
    symbol: string;
  };
};
export type TGetSchrodingerDetailResult = {
  getSchrodingerDetail: TSGRToken;
};

export type TGetSchrodingerDetail = (
  client: TGraphQLClient,
  params: TGetSchrodingerDetailParams,
) => TCommonGraphQLResult<TGetSchrodingerDetailResult>;

export type TGetStrayCatsParams = {
  input: {
    adopter: string;
    chainId: string;
    skipCount?: number;
    maxResultCount?: number;
  };
};

export type TStrayCats = {
  inscriptionImageUri: string;
  tokenName: string;
  gen: number;
  symbol: string;
  consumeAmount: number;
  receivedAmount: number;
  decimals: number;
  adoptId: string;
  parentTraits: Omit<ITrait, 'percent'>[];
};

export type TGetStrayCatsResult = {
  getStrayCats: {
    totalCount: number;
    data: Array<TStrayCats>;
  };
};

export type TGetStrayCats = (
  client: TGraphQLClient,
  params: TGetStrayCatsParams,
) => TCommonGraphQLResult<TGetStrayCatsResult>;
