import { TEmptyChannelInfo, TEmptyChannelGroup } from 'types/misc';

export enum ThemeType {
  'dark' = 'dark',
  'light' = 'light',
}

export type InfoStateType = {
  isMobile?: boolean;
  isSmallScreen?: boolean;
  theme: ThemeType;
  baseInfo: {
    rpcUrl?: string;
    identityPoolID?: string;
    // some config
  };
  loginTrigger?: 'join' | 'login';
  cmsInfo?: {
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
    openTimeStamp: string;
    routerItems: string;

    graphqlSchrodinger: string;
    emptyChannelGroupDescription: string;
    emptyChannelGroupList: string;

    adoptRuleList: string;
    isTradeShow: boolean;
    isMarketShow: boolean;
    tradeDescription: string;
    tradeList: string;
    // symbol black list stringify
    blackList?: string;

    // user white list stringify
    userWhiteList?: string;
    forestUrl: string;
    s3ImagePrefix: string;
    ifpsPrefix: string;
    gitBookDescription: string;
    gitBookLink: string;
    [key: string]: any;
  };
  itemsFromLocal?: string[];
  hasToken?: boolean;
  joinInfo: {
    isJoin: boolean;
    loading: boolean;
  };
};

export type TTradeItem = {
  title: string;
  description: string;
  imgUrl: string;
  link: string;
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
  layoutBackground?: string;
  headerTheme?: CustomThemeType;
  hideHeaderMenu: boolean;
  footerTheme?: CustomThemeType;
};
