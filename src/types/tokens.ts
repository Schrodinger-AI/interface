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
  inscriptionImage: string;
  amount: string;
  generation: number;
  blockTime: number;
  decimals: number;
  inscriptionInfo?: string;
  address?: string; // temp key
};

export type TSGRItem = TBaseSGRToken & {
  inscriptionDeploy: string;
  adopter: string;
  adoptTime: number;
};

export type TSGRToken = GenerateType<
  TBaseSGRToken & {
    traits: ITrait[];
  }
>;
