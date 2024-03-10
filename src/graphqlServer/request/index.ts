import { GET_SCHRODINGER_DETAIL_QUERY, GET_SCHRODINGER_LIST_QUERY } from '../queries';
import { TGetSchrodingerDetail, TGetSchrodingerList } from '../types';

export const getSchrodingerList: TGetSchrodingerList = (client, params) => {
  return client.query({
    query: GET_SCHRODINGER_LIST_QUERY,
    variables: params,
  });
};

export const getSchrodingerDetail: TGetSchrodingerDetail = (client, params) => {
  return client.query({
    query: GET_SCHRODINGER_DETAIL_QUERY,
    variables: params,
  });
};
