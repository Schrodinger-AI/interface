export interface ISGRDetailRes {
  name: string;
  symbol: string;
  imageUrl: string;
  amount: string;
  generation: number;
  generationDesc: string;
  traits: ISGRDetailTrait[];
}

export interface ISGRDetailTrait {
  traitType: string;
  value: string;
  percent: number;
}

export enum PageFrom {
  ALL = 'from',
  MY = 'my',
}
