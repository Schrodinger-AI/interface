import { gql } from '@apollo/client';

export const GET_SCHRODINGER_LIST_QUERY = gql`
  query schrodingerList($input: GetSchrodingerList) {
    schrodingers(input: $input) {
      totalCount
      data {
        adoptId
        name
        symbol
        image
        amount
        generation
        blockTime
        traits {
          traitType
          value
          percent
        }
      }
    }
  }
`;
