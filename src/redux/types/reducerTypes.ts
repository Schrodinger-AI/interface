import { ICompassProps } from 'components/Header/type';
import { TNftActivityListByConditionInput } from 'graphqlServer';
import { ListTypeEnum } from 'types';
import { TEmptyChannelGroup } from 'types/misc';

export enum ThemeType {
  'dark' = 'dark',
  'light' = 'light',
}

export type InfoStateType = {
  isMobile?: boolean;
  isSmallScreen?: boolean;
  theme: ThemeType;
  adInfo?: any;
  baseInfo: {
    rpcUrl?: string;
    identityPoolID?: string;
    // some config
  };
  cmsInfo?: TCustomizationItemType & TGlobalConfigType;
  itemsFromLocal?: string[];
  isJoin: boolean;
  curViewListType: ListTypeEnum;
  unreadMessagesCount: number;
  hasNewActivities: boolean;
};

export type TTradeItem = {
  title: string;
  description: string;
  imgUrl: string;
  link: string;
  show: boolean;
};

export type TAssetsStateType = {
  txFee?: {
    common: number;
  };
  tokenPriceMap?: Record<string, string>;
};

export enum CustomThemeType {
  'dark' = 'dark',
  'light' = 'light',
}

export type TCustomThemeType = {
  layout: {
    backgroundStyle?: string;
  };
  header: {
    theme: CustomThemeType;
    hideMenu: boolean;
  };
  footer: {
    theme: CustomThemeType;
  };
};

export type TBannerConfigButton = {
  text: string;
  buttonType?: 'default' | 'primary';
  link?: string;
  linkType?: TLinkType;
};

export type TBannerConfigItem = {
  backgroundImage?: {
    pc: string;
    mobile: string;
    mid?: string;
  };
  show?: boolean;
  button?: TBannerConfigButton[];
};

export type TCustomizationItemType = {
  isShowRampBuy: boolean;
  isShowRampSell: boolean;
  routerItems: Array<ICompassProps>;
  latestModal: {
    show: boolean;
    title: string;
    desc: string;
    btnText: string;
    btnUrl: string;
  };
  tradeModal: {
    show: boolean;
    title: string;
    desc: string;
    type?: 'link' | 'modal' | 'externalLink';
    link?: string;
    items: Array<TTradeItem>;
  };
  gen0TradeModal: {
    show: boolean;
    title: string;
    desc: string;
    type?: 'link' | 'modal' | 'externalLink';
    link?: string;
    items: Array<TTradeItem>;
  };
  tradeModalOnMarketPlace: {
    title: string;
    desc: string;
    items: Array<TTradeItem>;
  };
  gitBookLink: string;
  gitBookDescription: string;
  adoptRuleUrl: string;
  adoptRuleList: Array<string>;
  blackList: Array<string>;
  emptyChannelGroupList: Array<TEmptyChannelGroup>;
  emptyChannelGroupDescription: Array<string>;
  bannerConfig?: Record<string, TBannerConfigItem>;
  needBindEvm?: string[];
  [key: string]: any;
};

export type TGlobalConfigType = {
  networkType: 'TESTNET' | 'MAIN';
  networkTypeV2: 'TESTNET' | 'MAINNET';
  connectUrlV2: string;
  portkeyServerV2: string;
  graphqlServerV2: string;
  curChain: Chain;
  rpcUrlAELF: string;
  rpcUrlTDVW: string;
  rpcUrlTDVV: string;
  schrodingerMainAddress: string;
  schrodingerSideAddress: string;
  tokenMainAddress: string;
  tokenSideAddress: string;
  graphqlSchrodinger: string;
  graphqlForest: string;
  nftActivityListFilter: TNftActivityListByConditionInput;
  forestUrl: string;
  s3ImagePrefix: string;
  ifpsPrefix: string;
  rankListEntrance?: {
    open?: boolean;
    title?: string;
    link?: string;
    style?: {
      backgroundColor?: string;
      color?: string;
    };
  };
  rarityFilterItems: Array<{
    label: string;
    value: string;
  }>;
  forestActivity?: string;
  ecoEarn?: string;
  showNftQuantity?: number;
  [key: string]: any;
};

export enum LoginState {
  initial = 'initial',
  lock = 'lock',
  eagerly = 'eagerly',
  logining = 'logining',
  logined = 'logined',
  logouting = 'logouting',
}

export type TLoginStatusType = {
  loginStatus: {
    walletStatus: LoginState;
    isConnectWallet: boolean;
    hasToken: boolean;
    isLogin: boolean;
  };
};

export interface IRankList {
  scores: string;
  address: string;
}

export interface IRulesSectionData {
  size: string;
  ranking: string;
  rewards: string;
  inviter: string;
}

export interface IKOLRulesSectionData {
  ranking: string;
  rewards: string;
}

export interface IRulesSectionHeader {
  title: string;
  width: number;
  key: string;
}

export interface IRulesSection {
  header: IRulesSectionHeader[];
  data: IRulesSectionData[];
}

export interface IKOLRulesSection {
  header: IRulesSectionHeader[];
  data: IKOLRulesSectionData[];
}

export interface IRankListPageConfigLink {
  type: 'img-link' | 'img-externalLink' | 'link' | 'externalLink';
  imgUrl?: {
    pc: string;
    mobile: string;
  };
  text?: string;
  link?: string;
  style?: string;
}

export interface IRankListPageConfig {
  pageTitle?: string;
  title?: string;
  description?: string[];
  showAnnouncement?: boolean;
  link?: IRankListPageConfigLink[];
  content?: string[];
}

export interface IRankListData {
  lp: {
    title?: string;
    description?: string[];
    rules?: {
      title?: string;
      rulesList?: string[];
      rulesSection?: IRulesSection;
      kolRulesSection?: IKOLRulesSection;
    };
    list: IRankList[];
  };
  subdomain?: {
    title?: string;
    description?: string[];
    list?: (IRankList & {
      link: string;
    })[];
  };
  pageConfig?: IRankListPageConfig;
}

export interface IActivityDetailRulesLink {
  type: 'img-link' | 'img-externalLink' | 'link' | 'externalLink';
  imgUrl?: {
    pc: string;
    mobile: string;
  };
  text?: string;
  link?: string;
  style?: Record<string, any>;
}

export interface IActivityDetailRulesTable {
  data: Record<string, string | number>[];
  header: {
    key: string;
    title: string;
    width: number;
    tooltip?: string[];
    type?: 'address' | 'number' | 'text';
  }[];
}

export interface IActivityDetailCardImage {
  link?: string;
  linkType?: TLinkType;
  url: string;
  className?: string;
}

export interface IActivityDetailCard {
  title?: string;
  backgroundImage?: string;
  image?: IActivityDetailCardImage;
  description?: string[];
}

export enum HandleCardType {
  'BindEVM' = 'bindEVM',
}

export interface IActivityDetailHandle {
  type: HandleCardType;
}

export interface IActivityDetailRules {
  title?: string;
  titleIcon?: string;
  subTitle?: string[];
  description?: string[];
  rulesTable?: IActivityDetailRulesTable;
  link?: IActivityDetailRulesLink[];
  bottomDescription?: string[];
  cardList?: IActivityDetailCard[];
  handleCard?: IActivityDetailHandle[];
}

export interface IActivityDetailData {
  pageTitle?: string;
  rules?: IActivityDetailRules[];
}
