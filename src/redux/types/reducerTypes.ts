import { TEmptyChannelInfo, TEmptyChannelGroup } from 'types/misc';

export type InfoStateType = {
  isMobile?: boolean;
  isSmallScreen?: boolean;
  theme: string | undefined | null;
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
    [key: string]: any;
  };
  itemsFromLocal?: string[];
  hasToken?: boolean;
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
