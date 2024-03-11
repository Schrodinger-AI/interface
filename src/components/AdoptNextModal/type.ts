import { ITrait } from 'types/tokens';
import { TAIImage } from 'components/AIImageSelect';

export interface IAdoptNextData {
  SGRToken: {
    tokenName?: string;
    symbol?: string;
    amount?: string;
  };
  newTraits: ITrait[];
  images: TAIImage[];
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
