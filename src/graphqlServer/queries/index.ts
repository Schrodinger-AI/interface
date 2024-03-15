import { gql } from '@apollo/client';

export const GET_SCHRODINGER_LIST_QUERY = gql`
  query getSchrodingerList($input: GetSchrodingerListInput) {
    getSchrodingerList(input: $input) {
      totalCount
      data {
        symbol
        tokenName
        inscriptionImage
        inscriptionImageUri
        amount
        generation
        decimals
      }
    }
  }
`;

export const GET_SCHRODINGER_DETAIL_QUERY = gql`
  query getSchrodingerDetail($input: GetSchrodingerDetailInput) {
    getSchrodingerDetail(input: $input) {
      symbol
      tokenName
      inscriptionImage
      inscriptionImageUri
      amount
      generation
      decimals
      traits {
        traitType
        value
        percent
      }
    }
  }
`;

export const GET_STRAY_CATS_QUERY = gql`
  query getStrayCats($input: StrayCatInput) {
    getStrayCats(input: $input) {
      totalCount
      data {
        inscriptionImageUri
        tokenName
        gen
        symbol
        consumeAmount
        receivedAmount
      }
    }
  }
`;
