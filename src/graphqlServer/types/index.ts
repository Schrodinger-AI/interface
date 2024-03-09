import { ApolloQueryResult } from '@apollo/client';
import { TGraphQLClient } from './common';

export type TCommonGraphQLResult<T> = Promise<ApolloQueryResult<T>>;

export type TGetTraitsParams = {
  dto: {
    chainId?: string;
    maxResultCount: number;
    skipCount: number;
    symbol?: string;
  };
};
export type TGetTraitsResult = {};
export type TGetTraits = (client: TGraphQLClient, params: TGetTraitsParams) => TCommonGraphQLResult<TGetTraitsResult>;

export * from './common';
