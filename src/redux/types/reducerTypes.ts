import { ICompassProps } from 'components/Header/type';

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

    graphqlSchrodinger: string;
    emptyChannelGroupDescription: string;
    emptyChannelGroupList: string;

    adoptRuleList: string;
    // symbol black list stringify
    blackList?: string;

    forestUrl: string;
    s3ImagePrefix: string;
    ifpsPrefix: string;
    gitBookDescription: string;
    gitBookLink: string;
    customization: string;
    [key: string]: any;
  };
  itemsFromLocal?: string[];
  hasToken?: boolean;
  isJoin: boolean;
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

export type TCustomizationType = {
  pc: TCustomizationItemType;
  android: TCustomizationItemType;
  ios: TCustomizationItemType;
};

export type TCustomizationItemType = {
  routerItems: {
    items: Array<ICompassProps>;
  };
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
    items: Array<TTradeItem>;
  };
  tradeModalOnMarketPlace: {
    title: string;
    desc: string;
    items: Array<TTradeItem>;
  };
};
