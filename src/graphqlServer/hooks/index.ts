import {
  getLatestSchrodingerList,
  getSchrodingerDetail,
  getSchrodingerList,
  getStrayCats,
  getSubTraits,
  getTraits,
  getAllTraits,
  getAllSubTraits,
} from '../request';
import { getGraphQLClient } from '../client';
import { useCallback, useMemo } from 'react';
import { TGraphQLParamsType } from '../types';
import { useCmsInfo } from 'redux/hooks';
import { ListTypeEnum } from 'pageComponents/tokensPage/type';

export const useGraphQLClient = () => {
  const cmsInfo = useCmsInfo();
  return getGraphQLClient(cmsInfo?.graphqlSchrodinger || '');
};

export const useGetSchrodingerList = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getSchrodingerList>) => getSchrodingerList(client, params),
    [client],
  );
};

export const useGetSchrodingerDetail = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getSchrodingerDetail>) => getSchrodingerDetail(client, params),
    [client],
  );
};

export const useGetTraits = (type: ListTypeEnum) => {
  const client = useGraphQLClient();
  const requestApi = useMemo(() => {
    return type === ListTypeEnum.My ? getTraits : getAllTraits;
  }, [type]);
  return useCallback(
    (params: TGraphQLParamsType<typeof requestApi>) => requestApi(client, params),
    [client, requestApi],
  );
};

export const useGetSubTraits = (type: ListTypeEnum) => {
  const client = useGraphQLClient();
  const requestApi = useMemo(() => {
    return type === ListTypeEnum.My ? getSubTraits : getAllSubTraits;
  }, [type]);
  return useCallback(
    (params: TGraphQLParamsType<typeof requestApi>) => requestApi(client, params),
    [client, requestApi],
  );
};

export const useGetStrayCats = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getStrayCats>) => getStrayCats(client, params), [client]);
};

export const useGetLatestSchrodingerList = () => {
  const client = useGraphQLClient();
  return useCallback(
    (params: TGraphQLParamsType<typeof getLatestSchrodingerList>) => getLatestSchrodingerList(client, params),
    [client],
  );
};
