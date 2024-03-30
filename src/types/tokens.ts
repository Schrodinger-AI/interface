import { GenerateType } from './utils';

export interface ITrait {
  traitType: string;
  value: string;
  percent: number;
}

export type TBaseSGRToken = {
  tick: string;
  symbol: string;
  tokenName: string;
  amount: string;
  generation: number;
  blockTime: number;
  decimals: number;
  inscriptionImageUri: string;
  rank?: string;
  rankInfo?: {
    probability?: string;
    rank: string;
    total?: string;
  };
};

export type TSGRItem = TBaseSGRToken & {
  inscriptionDeploy: string;
  adopter: string;
  adoptTime: number;
  rankInfo?: IRankInfo;
  traits: ITrait[];
};

export type TSGRToken = GenerateType<
  TBaseSGRToken & {
    traits: ITrait[];
  }
>;
