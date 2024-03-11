export interface ITrait {
  traitType: string;
  value: string;
  percent: number;
}

export interface IToken {
  name: string;
  symbol: string;
  image: string;
  amount: string;
  generation: number;
  blockTime: number;
  traits: ITrait[];
}
