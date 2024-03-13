import {
  GET_SCHRODINGER_DETAIL_QUERY,
  GET_SCHRODINGER_LIST_QUERY,
  GET_SUB_TRAITS_QUERY,
  GET_TRAITS_QUERY,
} from '../queries';
import { TGetSchrodingerDetail, TGetSchrodingerList, TGetSubTraits, TGetTraits } from '../types';

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

export const getTraits: TGetTraits = (client, params) => {
  return client.query({
    query: GET_TRAITS_QUERY,
    variables: params,
  });
};

export const getSubTraits: TGetSubTraits = (client, params) => {
  return client.query({
    query: GET_SUB_TRAITS_QUERY,
    variables: params,
  });
};
