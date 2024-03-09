import { ApolloQueryResult } from '@apollo/client';
import { TGraphQLClient } from './common';
export * from './common';

export type TCommonGraphQLResult<T> = Promise<ApolloQueryResult<T>>;

export type TGetSchrodingerListParams = {
  input: {
    chainId: string;
    caHash?: string;
    address?: string;
    traits?: Array<{ traitType: string; value: string }>;
    generations?: Array<number>;
    skipCount?: number;
    maxResultCount?: number;
    keyword?: string;
    adoptId?: string;
  };
};
export type TGetSchrodingerListResult = {
  totalCount: number;
  data: Array<any>;
};
export type TGetSchrodingerList = (
  client: TGraphQLClient,
  params: TGetSchrodingerListParams,
) => TCommonGraphQLResult<TGetSchrodingerListResult>;
