import { ApolloQueryResult } from '@apollo/client';
import { TGraphQLClient } from './common';

export type TCommonGraphQLResult<T> = Promise<ApolloQueryResult<T>>;

export type TGetTokenInfoParams = {
  dto: {
    chainId?: string;
    maxResultCount: number;
    skipCount: number;
    symbol?: string;
  };
};
export type TGetTokenInfoResult = {};
export type TGetTokenInfo = (
  client: TGraphQLClient,
  params: TGetTokenInfoParams,
) => TCommonGraphQLResult<TGetTokenInfoResult>;

export * from './common';
