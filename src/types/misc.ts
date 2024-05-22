import { TLinkType } from 'redux/types/reducerTypes';

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

export type TEmptyChannelIntroduction = {
  title: string;
  step: TEmptyChannelIntroductionStep[];
};

export type TEmptyChannelGroup = {
  title: string;
  list?: TEmptyChannelInfo[];
  banner?: TEmptyChannelBanner[];
  introduction?: TEmptyChannelIntroduction;
};
