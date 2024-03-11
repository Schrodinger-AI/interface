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
