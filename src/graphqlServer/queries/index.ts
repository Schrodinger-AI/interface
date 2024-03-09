import { gql } from '@apollo/client';

export const GET_TRAITS_QUERY = gql`
  query tokenInfo($input: GetTokenInfoDto) {
    traits(input: $input) {
      generations
      traits
    }
  }
`;
