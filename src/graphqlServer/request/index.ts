import { GET_SCHRODINGER_LIST_QUERY } from '../queries';
import { TGetSchrodingerList } from '../types';

export const getSchrodingerList: TGetSchrodingerList = (client, params) => {
  return client.query({
    query: GET_SCHRODINGER_LIST_QUERY,
    variables: params,
  });
};
