import { HandleCardType } from 'redux/types/reducerTypes';

export interface IEventsDetailListTable {
  data: Record<string, string | number>[];
  header: {
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
}

export interface IEventsDetailListHandle {
  type: HandleCardType;
}

export interface IEventsDetailList {
  title?: string;
  titleIcon?: string;
  subTitle?: string[];
  description?: string[];
  eventsTable?: IEventsDetailListTable;
  link?: IEventsDetailListLink[];
  bottomDescription?: string[];
  stepsCardList?: IEventsDetailListStepsCard[];
  handleCard?: IEventsDetailListHandle[];
}
