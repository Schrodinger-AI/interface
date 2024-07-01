import { HandleCardType } from 'redux/types/reducerTypes';

export interface IEventsDetailListTable {
  server?: string;
  data?: Record<string, string | number>[];
  header?: {
    key: string;
    title: string;
    width: number;
    tooltip?: string[];
    type?: 'address' | 'number' | 'text';
  }[];
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
  linkType?: TLinkType;
  url: string;
  className?: string;
}

export interface IEventsDetailListStepsCard {
  title?: string;
  backgroundImage?: string;
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
