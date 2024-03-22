import { TRAIT_DATA, TRAIT_TYPE_DATA, TRAIT_LEVELS } from 'constants/traitData';
import BigNumber from 'bignumber.js';

export const getTraitPercent = (traitType: string, value: string) => {
  return TRAIT_DATA[traitType]?.[value] || 0;
};

export const getTraitTypePercent = (traitType: string) => {
  return TRAIT_TYPE_DATA[traitType] || 0;
};

export const getRarity = (typeArray: string[], valueArray: string[]) => {
  const levelsObject: any = {};
  TRAIT_LEVELS.forEach((level, index) => {
    levelsObject[index] = {
      amount: 0,
      rarity: new BigNumber(level).times(100).toString() + '%',
    };
  });
  typeArray.forEach((type, typeIndex) => {
    const typeRarity = TRAIT_TYPE_DATA[type];
    const valueRarity = TRAIT_DATA[type][valueArray[typeIndex]];
    const rarityBignumber = new BigNumber(typeRarity).times(valueRarity).div(100);
    const rarity = rarityBignumber.toNumber();
    // console.log('levels.indexOf(rarity):', levels.indexOf(rarity), rarity);
    levelsObject[TRAIT_LEVELS.indexOf(rarity)].amount += 1;
    console.info(
      `${typeIndex} Type ${type} rarity: ${typeRarity} %; Value ${valueArray[typeIndex]} rarity: ${new BigNumber(
        valueRarity,
      )
        .times(100)
        .toString()} %; total rarity: ${rarityBignumber.times(100).toNumber()} %, level: ${TRAIT_LEVELS.indexOf(
        rarity,
      )}`,
    );
  });
  console.info('rarityInfo', levelsObject);
};
