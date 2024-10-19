export type TPositionDistance = 'default' | 'large' | 'small';
export type TTagSize = 'default';

export const imageType = {
  cover: 'object-cover',
  contain: 'object-contain',
};

export const formatTagContent = (value: string | number, key: string) => {
  return {
    generation: `GEN ${value}`,
    level: `Lv. ${value}`,
    specialTrait: value,
  }[key];
};

interface ILabelStyle {
  [key: string]: {
    size: Record<TTagSize, string>;
    position: Record<TPositionDistance, string>;
    hasRarityPosition?: Record<TPositionDistance, string>;
  };
}

export const labelStyle: ILabelStyle = {
  generation: {
    size: {
      default: 'px-[4px] rounded-[4px] text-[10px] leading-[16px] font-medium h-[18px] ',
    },
    position: {
      default: 'top-[8px] left-[8px] px-[4px]',
      large: 'top-[12px] left-[12px] px-[4px]',
      small: '',
    },
  },
  level: {
    size: {
      default: 'px-[4px] rounded-[4px] text-[10px] leading-[16px] font-medium h-[18px] ',
    },
    position: {
      default: 'top-[30px] left-[8px] px-[4px]',
      large: 'top-[34px] left-[12px] px-[4px]',
      small: '',
    },
  },
  rarity: {
    size: {
      default: '',
    },
    position: {
      default: 'top-[8px] right-[8px]',
      large: 'top-[12px] right-[12px]',
      small: 'top-[4px] right-[4px]',
    },
  },
  specialTrait: {
    size: {
      default: 'px-[4px] rounded-[4px] text-[10px] leading-[16px] font-medium h-[18px] ',
    },
    position: {
      default: 'top-[8px] right-[8px]',
      large: 'top-[12px] right-[12px]',
      small: '',
    },
    hasRarityPosition: {
      default: 'top-[32px] right-[8px]',
      large: 'top-[36px] right-[12px]',
      small: '',
    },
  },
};
