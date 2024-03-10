import { gql } from '@apollo/client';

export const GET_SCHRODINGER_LIST_QUERY = gql`
  query getSchrodingerList($input: GetSchrodingerListInput) {
    getSchrodingerList(input: $input) {
      totalCount
      data {
        tick
        symbol
        tokenName
        inscriptionImage
        amount
        generation
        blockTime
        decimals
      }
    }
  }
`;

export const GET_SCHRODINGER_DETAIL_QUERY = gql`
  query getSchrodingerDetail($input: GetSchrodingerDetailInput) {
    getSchrodingerDetail(input: $input) {
      tick
      symbol
      tokenName
      inscriptionImage
      amount
      generation
      blockTime
      decimals
      traits {
        traitType
        value
        percent
      }
    }
  }
`;
