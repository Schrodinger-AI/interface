import { GenerateType } from './utils';

interface ITrait {
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
};

export type TSGRToken = GenerateType<
  TBaseSGRToken & {
    traits: ITrait[];
  }
>;
