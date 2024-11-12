import { catsRankProbability } from 'api/request';

export const getCatsRankProbability: (params: {
  symbol: string;
}) => Promise<TRankInfoAddLevelInfo | false> = async (params: { symbol: string }) => {
  try {
    if (!params?.symbol) return false;
    const rankProbability = await catsRankProbability(params);

    if (!rankProbability) {
      return false;
    }

    // const formatRankProbability: TRankInfoAddLevelInfo[] = rankProbability.map((item) => {
    //   return {
    //     ...item.rank,
    //     levelInfo: item.levelInfo,
    //   };
    // });
    const formatRankProbability: TRankInfoAddLevelInfo = {
      ...rankProbability.rank,
      levelInfo: rankProbability.levelInfo,
    };
    return formatRankProbability;
  } catch (error) {
    return false;
  }
};
