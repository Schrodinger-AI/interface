import { GET_TRAITS_QUERY } from '../queries';
import { TGetTraits } from '../types';

export const getTraits: TGetTraits = (client, params) => {
  return client.query({
    query: GET_TRAITS_QUERY,
    variables: params,
  });
};
