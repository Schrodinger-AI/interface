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
