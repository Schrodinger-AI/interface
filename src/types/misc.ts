export type TEmptyChannelInfo = {
  title: string;
  description: string;
  imgUrl: string;
  link: string;
};

export type TEmptyChannelBanner = {
  link?: string;
  linkType?: TLinkType;
  imgUrl: {
    pc: string;
    mobile: string;
  };
};

export type TEmptyChannelIntroductionStep = {
  title?: string;
  description?: string[];
  card?: {
    image: string;
  };
};

export type TEmptyChannelIntroductionList = {
  title?: string;
  description?: string[];
  image?: {
    pc: string;
    mobile: string;
    link?: string;
    linkType?: TLinkType;
  }[];
  imageDark?: {
    pc: string;
    mobile: string;
    link?: string;
    linkType?: TLinkType;
  }[];
};

export type TEmptyChannelIntroduction = {
  title: string;
  step?: TEmptyChannelIntroductionStep[];
  list?: TEmptyChannelIntroductionList[];
};

export type TEmptyChannelGroup = {
  title: string;
  list?: TEmptyChannelInfo[];
  banner?: TEmptyChannelBanner[];
  introduction?: TEmptyChannelIntroduction;
};

export enum SpinRewardType {
  Other = 0,
  Point = 1,
  AdoptionVoucher = 2,
  Token = 3,
}
