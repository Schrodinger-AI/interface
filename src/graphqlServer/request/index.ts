import { GET_TOKEN_INFO_QUERY } from '../queries';
import { TGetTokenInfo } from '../types';

export const getTokenInfo: TGetTokenInfo = (client, params) => {
  console.log('getTokenInfo, params', params);
  return client.query({
    query: GET_TOKEN_INFO_QUERY,
    variables: params,
  });
};
