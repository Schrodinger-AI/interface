import { ITrait } from 'types/tokens';
import { TAIImage } from 'components/AIImageSelect';

export interface IAdoptNextData {
  SGRToken: {
    tokenName?: string;
    symbol?: string;
    amount?: number;
  };
  newTraits: ITrait[];
  images: TAIImage[];
  inheritedTraits: ITrait[];
  transaction: {
    txFee?: number;
    usd?: number;
  };
  balance: {
    amount?: number;
    usd?: number;
  };
}

const traits: ITrait[] = [
  {
    traitType: 'Eyes',
    value: 'Blue Star',
    percent: 5.22,
  },
  {
    traitType: 'Eyes',
    value: 'Blue Star',
    percent: 5.22,
  },
  {
    traitType: 'Eyes',
    value: 'Blue Star',
    percent: 5.22,
  },
  {
    traitType: 'Eyes',
    value: 'Blue Star',
    percent: 5.22,
  },
];

const imageList = [
  {
    traits: [],
    name: '',
    value: '',
    image: require('assets/img/cat.png').default.src,
    waterMarkImage: '',
    secretImage: '',
    secretWaterMarkImage: require('assets/img/cat.png').default.src,
  },
  {
    traits: [],
    name: '',
    value: '',
    image: require('assets/img/schrodinger.jpeg').default.src,
    waterMarkImage: '',
    secretImage: '',
    secretWaterMarkImage: require('assets/img/cat.png').default.src,
  },
  {
    traits: [],
    name: '',
    value: '',
    image: require('assets/img/schrodinger.jpeg').default.src,
    waterMarkImage: '',
    secretImage: '',
    secretWaterMarkImage: require('assets/img/cat.png').default.src,
  },
  {
    traits: [],
    name: '',
    value: '',
    image: require('assets/img/schrodinger.jpeg').default.src,
    waterMarkImage: '',
    secretImage: '',
    secretWaterMarkImage: require('assets/img/cat.png').default.src,
  },
];

export const mockAdoptNextData: IAdoptNextData = {
  SGRToken: {
    tokenName: 'SGR-2GEN1',
    symbol: 'SGR-1',
    amount: 10000,
  },
  newTraits: traits,
  images: [imageList[0]],
  inheritedTraits: traits,
  transaction: {
    txFee: 0.92,
    usd: 0.45,
  },
  balance: {
    amount: 10000,
    usd: 9999,
  },
};
