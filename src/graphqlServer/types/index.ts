import { ApolloQueryResult } from '@apollo/client';
import { TGraphQLClient } from './common';
import { TBaseSGRToken, TSGRToken } from 'types/tokens';
export * from './common';

export type TCommonGraphQLResult<T> = Promise<ApolloQueryResult<T>>;

export type TGetSchrodingerListParams = {
  input: {
    chainId: string;
    address?: string;
    traits?: Array<{ traitType: string; value: string }>;
    generations?: Array<number>;
    skipCount?: number;
    maxResultCount?: number;
    keyword?: string;
    tick?: string;
  };
};
export type TGetSchrodingerListResult = {
  totalCount: number;
  data: Array<TBaseSGRToken>;
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

export type TGetSchrodingerDetail = (
  client: TGraphQLClient,
  params: TGetSchrodingerDetailParams,
) => TCommonGraphQLResult<TSGRToken>;
