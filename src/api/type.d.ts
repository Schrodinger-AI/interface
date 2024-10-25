interface ITokenParams {
  grant_type: string;
  scope: string;
  client_id: string;
  pubkey?: string;
  version?: string;
  signature?: string;
  timestamp?: number;
  accountInfo?: Array<{ chainId: string; address: string }>;
  source: string;
}

interface IUsersAddressReq {
  address: string;
}

interface IUsersAddressRes {
  address: string;
  fullAddress: string;
  name: string;
  profileImage: string;
  profileImageOriginal: string;
  bannerImage: string;
  email: string;
  twitter: string;
  instagram: string;
}

interface IBaseTrait {
  traitType: string;
  value: string;
}

interface IAdoptImageInfo {
  adoptImageInfo: {
    generation: number;
    attributes: (IBaseTrait & { percent: number })[];
    images: string[];
    boxImage: string;
  };
  image: string;
  signature: string;
  imageUri: string;
}

interface IWaterImageRequest {
  image: string;
  adoptId: string;
}

interface IWaterImage {
  image: string;
  signature: string;
  imageUri: string;
}
interface IGetPointsParams {
  domain: string;
  address: string;
}

interface IPointItem {
  action: string;
  displayName: string;
  symbol: string;
  amount: number;
  rate: number;
  updateTime: number;
  inviteFollowersNumber: number;
  inviteRate: number;
  thirdFollowersNumber: number;
  thirdRate: number;
  ecoEarnReward: number;
}

interface IGetPointsData {
  totalScore?: string;
  totalReward?: string;
  pointDetails: Array<IPointItem>;
  hasBoundAddress: boolean;
  evmAddress?: string;
}

interface ICatItemModel {
  name: string;
  symbol: string;
  image: string;
  amount: string;
  generation: number;
  blockTime: number;
  inscriptionInfo?: string; // if exists, it will be shown above the Image
  traits: Array<{
    traitType: string;
    value: string;
    percent: number;
  }>;
}

type TCatsRankProbabilityTraits = [[string[], string[]], [string[], string[]]];
interface ICatsRankProbabilityParams {
  catsTraits: TCatsRankProbabilityTraits[];
  address: string;
}

interface ICatsRankProbabilityData {
  rankGenOne: IRankGenInfo;
  rankTwoToNine: IRankGenInfo;
  rank: IRankInfo;
  levelInfo: ILevelInfo;
}

interface IRankInfo {
  rank: number;
  total: number;
  probability: string;
  percent: string;
  type: string;
  levelInfo: any;
  price: {
    elf: string;
    usd: string;
    sgr: string;
  };
}

interface IRankGenInfo {
  rank: number;
  total: number;
  probability: string;
  percent: string;
  traitsProbability: Record<string, number>;
  probabilityTypes: string[];
}

interface ILevelInfo {
  singleProbability: number | string;
  items: number | string;
  situation: number | string;
  totalProbability: number | string;
  token: string;
  classify: number | string;
  level: string;
  grade: number | string;
  star: number | string;
  describe: string;
  specialTrait?: string;
  awakenPrice: string | number;
}

type TRankInfoAddLevelInfo = IRankInfo & {
  levelInfo?: ILevelInfo;
};

interface ICatsListParams {
  chainId: string;
  address?: string; // wallet address
  searchAddress?: string; // search address
  tick?: string;
  traits?: Array<{
    traitType: string;
    values: string[];
  }>;
  generations?: number[];
  skipCount?: number;
  maxResultCount?: number;
  keyword?: string;
  rarities?: string[];
}

interface ICatDetailParams {
  chainId: string;
  symbol: string;
  address?: string; // wallet address
}

interface ITransactionMessageListParams {
  skipCount: number;
  maxResultCount: number;
  address: string;
}

interface ITransactionMessageListItem {
  nftInfoId: string;
  tokenName: string;
  previewImage: string;
  price: number;
  amount: number;
  from: string;
  to: string;
  type: number;
  rank: number;
  rarity: string;
  awakenPrice: string;
  createtime: number;
  star: string;
  grade: string;
  generation: number;
  level: string;
  describe: string;
}

interface ITransactionMessageListData {
  totalCount: number;
  data: ITransactionMessageListItem[];
}

type TLinkType = 'externalLink' | 'link';

interface IActivityListItem {
  bannerUrl?: string;
  activityName?: string;
  activityId: string;
  beginTime?: string;
  endTime?: string;
  timeDescription?: string;
  isNew?: boolean;
  linkUrl?: string;
  linkType?: TLinkType;
}

interface IActivityList {
  hasNewActivity: boolean;
  totalCount: number;
  items: IActivityListItem[];
}

interface IListingsParams {
  searchParam?: string;
  chainId?: Chain;
  symbol?: string;
  skipCount?: number;
  maxResultCount?: number;
  excludedAddress?: string;
  address?: string;
}

interface IListingsResponse {
  items: IListingType[];
  totalCount: number;
}

interface IListingType {
  ownerAddress: string;
  owner: Owner;
  quantity: number;
  prices: number;
  whitelistPrices: number | null;
  symbol: string;
  startTime: number;
  publicTime: number;
  endTime: number;
  whitelistId: string | null;
  nftInfo: IListingNftInfo;
  purchaseToken: IPurchaseToken;
  id: string;
  decimals: number;
  originQuantity: number;
}

interface IGetTokenPriceData {
  price: number | string;
  timestamp: number;
}
interface INftInfo {
  chainId: Chain;
  issueChainId: number;
  issueChainIdStr: Chain;
  description: string | null;
  file: string | undefined;
  fileExtension: string | null;
  id: string;
  isOfficial: boolean;
  issuer: string;
  chainIdStr: string;
  proxyIssuerAddress: string;
  latestDealPrice: number;
  latestDealTime: string;
  latestDealToken: SaleTokens | null;
  latestListingTime: string | null;
  listingAddress: string | null;
  canBuyFlag: boolean;
  showPriceType: NftInfoPriceType;
  listingId: string | null;
  listingPrice: number;
  listingQuantity: number;
  listingEndTime: string | null;
  listingToken: SaleTokens | null;
  maxOfferPrice: number;
  maxOfferEndTime: string | null;
  metadata: MetadataType | null;
  nftSymbol: string;
  nftTokenId: number;
  previewImage: string | null;
  tokenName: string;
  totalQuantity: number;
  uri: string | null;
  whitelistId: string | null;
  price?: number;
  priceDescription?: string;
  whitelistPrice: number;
  whitelistPriceToken: SaleTokens | null;
  minter: ICreator | null;
  owner: ICreator | null;
  realOwner?: ICreator | null;
  decimals: string | number;
  nftCollection: {
    chainId: Chain;
    creator: ICreator;
    creatorAddress: string;
    description: string | null;
    featuredImage: string | null;
    id: string;
    isBurnable: boolean;
    isOfficial: boolean;
    issueChainId: number;
    logoImage: string | null;
    metadata: MetadataType | null;
    symbol: string;
    tokenName: string;
    totalSupply: number;
    baseUrl: string;
  } | null;
  createTokenInformation: {
    category: string | null;
    tokenSymbol: string | null;
    expires: number | null;
    registered: number | null;
  } | null;
  alias?: string;
  ownerCount: number;
  inscriptionInfo?: {
    tick?: string;
    issuedTransactionId?: string;
    deployTime?: number;
    mintLimit?: number;
  };
  describe?: string;
  rarity?: string;
  level?: string;
  generation: number;
  traitPairsDictionary: Array<Pick<ITraitInfo, 'key' | 'value'>>;
  _rankStrForShow?: string;
}

interface INftSaleInfoItem {
  tokenName: string;
  logoImage: string;
  collectionName: string;
  floorPrice?: number;
  floorPriceSymbol?: string;
  lastDealPrice?: number;
  lastDealPriceSymbol?: string;
  listingPrice?: number;
  maxOfferPrice?: number;
  availableQuantity?: number;
}
interface INftSaleInfoParams {
  id: string;
  excludedAddress?: string;
}

interface IActivityBotRankParams {
  tab: number; // 1:adopt 2:trade 3:invite
  address: string;
  isCurrent: boolean;
}

interface IActivityBotRankDataItem {
  address: string;
  scores: string;
  reward: string;
  updateTime?: string;
  rank?: number;
}

interface IActivityBotRankData {
  data: IActivityBotRankDataItem[];
  myScore: number;
  myReward: number;
  myRank: number;
}

interface ITgChannelParams {
  chat_id: string;
  user_id: string;
}

interface ITGChatMemmberResponse {
  ok: boolean;
  result: ITGChatMemmberResponseResult;
}

interface ITGChatMemmberResponseResult {
  status: string;
  user: ITGChatMemmberResponseUser;
}
interface ITGChatMemmberResponseUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
}
interface ITaskListData {
  countdown: number; // 1:adopt 2:trade 3:invite
  dailyTasks: ITaskItem[];
  socialTasks: ITaskItem[];
  accomplishmentTasks: ITaskItem[];
}

interface ITaskItem {
  [x: string]: any;
  taskId: string;
  name: string;
  status: number;
  link?: string;
  linkType?: TLinkType;
}

interface ITaskResponse {
  taskId: string;
  name: string;
  status: number;
  score: number;
  fishScore?: number;
}

interface ITaskPointsResponse {
  fishScore: number;
}

interface IVoteResponse {
  countdown: number;
  votes: number[];
}

interface RareItem {
  rate: string;
  data: ISpinPrizesPoolItem[];
}

interface ISpinPrizesPoolData {
  rareSuper: RareItem;
  rareGold: RareItem;
  rareSilver: RareItem;
  rareBronze: RareItem;
  rareCommon: RareItem;
}

interface ISpinPrizesPoolItem {
  amount: number;
  generation: number;
  describe: string;
  inscriptionImageUri: string;
}
interface ISpinReward {
  name: string;
  content: string;
}

interface ISpin {
  seed: string;
  tick: string;
  expirationTime: number;
  signature: number[];
}

interface ICouponAdoption {
  voucherId: string;
  signature: string;
  isRare: boolean;
}
