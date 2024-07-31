import { fetchNftInfo } from 'api/request';

interface IProps {
  nftId: string;
  address: string;
}

const getNftInfo = async ({ nftId, address }: IProps) => {
  try {
    const result = await fetchNftInfo({
      id: nftId,
      address,
    });

    if (!result || !result?.nftSymbol) {
      return false;
    }

    return result;
  } catch (error) {
    return false;
  }
};

export default getNftInfo;
