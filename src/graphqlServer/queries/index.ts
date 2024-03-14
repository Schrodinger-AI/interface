import { gql } from '@apollo/client';

export const GET_SCHRODINGER_LIST_QUERY = gql`
  query getSchrodingerList($input: GetSchrodingerListInput) {
    getSchrodingerList(input: $input) {
      totalCount
      data {
        symbol
        tokenName
        inscriptionImage
        amount
        generation
        decimals
        inscriptionDeploy
        adopter
        adoptTime
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

export const GET_TRAITS_QUERY = gql`
  query getTraits($input: GetTraitsInput) {
    getTraits(input: $input) {
      traitsFilter {
        traitType
        amount
      }
      generationFilter {
        key
        value
      }
    }
  }
`;

export const GET_SUB_TRAITS_QUERY = gql`
  query getTraits($input: GetTraitsInput) {
    getTraits(input: $input) {
      traitsFilter {
        traitType
        amount
        values {
          value
          amount
        }
      }
    }
  }
`;
