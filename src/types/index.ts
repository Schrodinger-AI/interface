import { Accounts, ChainId } from '@portkey/provider-types';
import { IBlockchainWallet } from '@portkey/types';
import { ManagerInfoType } from '@portkey/did-ui-react';
import { ITrait } from './tokens';

export type TBaseTokenInfo = {
  decimals: number;
  symbol: string;
};

export type TTokenInfo = TBaseTokenInfo & {
  tokenName?: string;
  address?: string;
  issueChainId?: number;
  issuer?: string;
  isBurnable?: boolean;
  totalSupply?: number;
};

export enum SupportedELFChainId {
  MAIN_NET = 'AELF',
  TDVV_NET = 'tDVV',
  TDVW_NET = 'tDVW',
}

export enum ContractMethodType {
  SEND = 'send',
  VIEW = 'view',
}

export interface IContractError extends Error {
  code?: number;
  error?:
    | number
    | string
    | {
        message?: string;
      };
  errorMessage?: {
    message: string;
    name?: string;
    stack?: string;
  };
  Error?: string;
  from?: string;
  sid?: string;
  result?: {
    TransactionId?: string;
    transactionId?: string;
  };
  TransactionId?: string;
  transactionId?: string;
  value?: any;
}

export interface IContractOptions {
  chain?: Chain | null;
  type?: ContractMethodType;
  reGetCount?: number;
}

export interface ISendResult<T = any> {
  TransactionId: string;
  TransactionResult: T;
}

export interface CallContractParams<T> {
  contractAddress: string;
  methodName: string;
  args: T;
}

export interface IDiscoverInfo {
  address?: string;
  nickName?: string;
  accounts?: Accounts;
}

export interface IDIDWalletInfo {
  caInfo: {
    caAddress: string;
    caHash: string;
  };
  pin: string;
  chainId: ChainId;
  walletInfo: IBlockchainWallet | { [key: string]: any };
  accountInfo: ManagerInfoType;
}
export type PortkeyInfoType = Partial<IDIDWalletInfo> & {
  accounts?: { [key: string]: any };
  walletInfo?: { [key: string]: any } | IBlockchainWallet;
};
export type WalletInfoType = {
  address: string;
  publicKey?: string;
  token?: string;
  //FIXME:
  discoverInfo?: any;
  portkeyInfo?: any;
  aelfChainAddress?: string;
};

export enum DeviceTypeEnum {
  iOS = 'ios',
  Android = 'android',
  Windows = 'windows',
  Macos = 'macos',
  Web = 'web',
}

export interface IAccountInfo {
  account?: string;
  token?: string;
  expirationTime?: number;
}

export enum ListTypeEnum {
  My = 1,
  All = 2,
  RARE = 3,
  Stray = 4,
  Blind = 5,
  Voucher = 6,
}

export type FormatListingType = {
  price: number;
  quantity: number;
  expiration: string;
  fromName: string;
  ownerAddress: string;
  whitelistHash: string | null;
  purchaseToken: { symbol: string };
  key: string;
  decimals: number;
  startTime: number;
  endTime: number;
  originQuantity: number;
};

export type TCancelListingType = {
  price: number;
  quantity: number;
  previewImage: string;
  collectionName: string;
  nftName: string;
  nftSymbol: string;
  originQuantity: number;
  startTime: number;
};

export enum ListType {
  NOT_LISTED,
  FIXED_PRICE,
  ENGLISH_AUCTION,
  DUTCH_AUCTION,
}

export interface IPrice {
  symbol: string;
  amount: number;
}

export interface ITimestamp {
  seconds: number;
  nanos: number;
}

export interface IListDuration {
  startTime: ITimestamp;
  publicTime: ITimestamp;
  durationHours?: number;
  durationMinutes: number;
}

export interface IListedNFTInfo {
  symbol: string;
  owner: string;
  quantity: number;
  listType: ListType;
  price: IPrice;
  duration: IListDuration;
}

export interface IVoucherInfo {
  voucherId: string;
  adopter: string;
  attributes: { data: ITrait[] };
  tick: string;
  is_rare: boolean;
  adoptId: string;
}

export enum SpinRewardType {
  Other = 'Other',
  Point = 'Point',
  AdoptionVoucher = 'AdoptionVoucher',
  Token = 'Token',
}

export interface ISpinInfo {
  spinId: string;
  name: string;
  type: SpinRewardType;
  amount: string;
  account: string;
}

export interface ISpunLogs {
  seed: string;
  spinInfo: ISpinInfo;
  tick: string;
  transactionHash: string;
}
