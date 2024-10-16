import {
  getLatestSchrodingerList,
  getSchrodingerDetail,
  getSubTraits,
  getTraits,
  getAllTraits,
  getAllSubTraits,
  nftActivityListByCondition,
} from '../request';
import { getGraphQLClient } from '../client';
import { useCallback } from 'react';
import { TGraphQLParamsType } from '../types';
import { useCmsInfo } from 'redux/hooks';

export const useGraphQLClient = () => {
  const cmsInfo = useCmsInfo();
  return getGraphQLClient(cmsInfo?.graphqlSchrodinger || '');
};

export const useGetSchrodingerDetail = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getSchrodingerDetail>) => getSchrodingerDetail(client, params),
    [client],
  );
};

export const useGetTraits = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getTraits>) => getTraits(client, params), [client]);
};

export const useGetAllTraits = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getAllTraits>) => getAllTraits(client, params), [client]);
};

export const useGetSubTraits = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getSubTraits>) => getSubTraits(client, params), [client]);
};

export const useGetSubAllTraits = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getAllSubTraits>) => getAllSubTraits(client, params), [client]);
};

export const useGetLatestSchrodingerList = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getLatestSchrodingerList>) => getLatestSchrodingerList(client, params),
    [client],
  );
};

// forest
export const useForestGraphQLClient = () => {
  const cmsInfo = useCmsInfo();
  return getGraphQLClient(cmsInfo?.graphqlForest || '');
};

export const useNftActivityListByCondition = () => {
  const client = useForestGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof nftActivityListByCondition>) => nftActivityListByCondition(client, params),
    [client],
  );
};
