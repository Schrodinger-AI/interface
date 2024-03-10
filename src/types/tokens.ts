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
};

export type TSGRToken = TBaseSGRToken & {
  traits: ITrait[];
};
