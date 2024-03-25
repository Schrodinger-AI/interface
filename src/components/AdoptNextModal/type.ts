import { ITrait } from 'types/tokens';

export interface IAdoptNextData {
  SGRToken: {
    tokenName?: string;
    symbol?: string;
    amount?: string | number;
  };
  allTraits: ITrait[];
  images: string[];
  inheritedTraits: ITrait[];
  transaction: {
    txFee?: string;
    usd?: string;
  };
  ELFBalance: {
    amount?: string;
    usd?: string;
  };
}
