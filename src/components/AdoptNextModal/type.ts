import { ITrait } from 'types/tokens';

export interface IAdoptNextData {
  SGRToken: {
    tokenName?: string;
    symbol?: string;
    amount?: string;
  };
  newTraits: ITrait[];
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
