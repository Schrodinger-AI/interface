import { gql } from '@apollo/client';

export const GET_TOKEN_INFO_QUERY = gql`
  query tokenInfo($dto: GetTokenInfoDto) {
    tokenInfo(dto: $dto) {
      id
      chainId
      blockHash
      blockHeight
      previousBlockHash
      symbol
      type
      tokenContractAddress
      decimals
      totalSupply
      tokenName
      issuer
      isBurnable
      issueChainId
    }
  }
`;
