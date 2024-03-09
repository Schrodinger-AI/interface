import { getTraits } from '../request';
import { getGraphQLClient } from '../client';
import { useCallback } from 'react';
import { TGraphQLParamsType } from '../types';
import { useCmsInfo } from 'redux/hooks';

export const useGraphQLClient = () => {
  const cmsInfo = useCmsInfo();

  return getGraphQLClient(cmsInfo?.graphqlServerV2 || '');
};

export const useGetTraits = () => {
  const client = useGraphQLClient();
  return useCallback((params: TGraphQLParamsType<typeof getTraits>) => getTraits(client, params), [client]);
};
