import { GET_SCHRODINGER_DETAIL_QUERY, GET_SCHRODINGER_LIST_QUERY, GET_STRAY_CATS_QUERY } from '../queries';
import { TGetSchrodingerDetail, TGetSchrodingerList, TGetStrayCats } from '../types';

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

export const getStrayCats: TGetStrayCats = (client, params) => {
  return client.query({
    query: GET_STRAY_CATS_QUERY,
    variables: params,
  });
};
