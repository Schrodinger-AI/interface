import { TStrayCats } from 'graphqlServer';
import { TBuyType } from 'hooks/useBuyToken';
import { HandleCardType } from 'redux/types/reducerTypes';

export interface IEventsDetailListTable {
  server?: string;
  params?: Record<string, any>;
  data?: Record<string, string | number>[];
  header?: {
    key: string;
    title: string;
    width: number;
    tooltip?: string[];
    fixed?: 'right' | 'left';
    type?: 'address' | 'number' | 'text';
  }[];
  myRank: number;
  myReward: number;
  myScore: number;
}

export interface IEventsDetailListLink {
  type: 'img-link' | 'img-externalLink' | 'link' | 'externalLink';
  imgUrl?: {
    pc: string;
    mobile: string;
  };
  text?: string;
  link?: string;
  style?: Record<string, any>;
}

export interface IEventsDetailListStepsCardImage {
  link?: string;
  linkType?: TLinkType | 'buyModal';
  buyType?: TBuyType;
  url: string;
  tgUrl?: string;
  className?: string;
}

export interface IEventsDetailListStepsCard {
  title?: string;
  backgroundImage?: string;
  darkBackgroundImage?: string;
  image?: IEventsDetailListStepsCardImage;
  description?: string[];
  link?: Omit<IEventsDetailListStepsCardImage, 'className'>[];
}

export interface IEventsDetailListHandle {
  type: HandleCardType;
}

export interface IEventsDetailList {
  title?: string;
  titleIcon?: string;
  subTitle?: string[];
  description?: string[];
  descriptionList?: {
    title?: string;
    description?: string[];
  }[];
  timeCard?: string[];
  eventsTable?: IEventsDetailListTable;
  link?: IEventsDetailListLink[];
  bottomDescription?: string[];
  stepsCardList?: IEventsDetailListStepsCard[];
  handleCard?: IEventsDetailListHandle[];
}

export interface IEventsDetailData {
  pageTitle?: string;
  list?: IEventsDetailList[];
}

export interface IEventsConfigItem {
  endTime: number;
  startTime: number;
}

export interface IEventsConfig {
  inProgress: IEventsConfigItem;
  displayed: IEventsConfigItem;
}

export enum RankType {
  'HOLDER' = 'holder',
  'COLLECTOR' = 'collector',
}

export interface IRankConfigItem {
  description?: string[];
  header?: IEventsDetailListTable['header'];
  server?: IEventsDetailListTable['server'];
}

export interface IRankConfigData {
  [RankType.HOLDER]: IRankConfigItem;
  [RankType.COLLECTOR]: IRankConfigItem;
  banner?: {
    pc: string;
    mobile: string;
  };
}

export interface IStrayCatsData {
  totalCount: number;
  data: TStrayCats[];
}
