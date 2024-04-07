import { catsRankProbability } from 'api/request';

export const getCatsRankProbability: (params: ICatsRankProbabilityParams) => Promise<IRankInfo[] | false> = async (
  params: ICatsRankProbabilityParams,
) => {
  try {
    if (!params?.catsTraits?.length) return false;
    const rankProbability = await catsRankProbability(params);

    if (!rankProbability.length) {
      return false;
    }

    const formatRankProbability: IRankInfo[] = rankProbability.map((item) => {
      return {
        rank: item.rank.rank,
        total: item.rank.total,
        probability: item.rank.probability,
        percent: item.rank.percent,
        traitsProbability: {
          ...(item.rankGenOne.traitsProbability || {}),
          ...(item.rankTwoToNine.traitsProbability || {}),
        },
        levelInfo: item.levelInfo || {},
      };
    });
    return formatRankProbability;
  } catch (error) {
    return false;
  }
};
