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
  };
}

interface IWaterImageRequest {
  image: string;
  adoptId: string;
}

interface IWaterImage {
  image: string;
  signature: string;
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
}

interface IGetPointsData {
  pointDetails: Array<IPointItem>;
}
