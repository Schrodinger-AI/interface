import { SocialMediaItem } from 'pageComponents/home/components/SocialMedia';

export const cmsInfo: {
  networkTypeV2?: 'TESTNET' | 'MAIN';
  connectUrlV2?: string;
  portkeyServerV2?: string;
  graphqlServerV2?: string;
  curChain?: Chain;
  rpcUrlAELF?: string;
  rpcUrlTDVW?: string;
  rpcUrlTDVV?: string;
  socialMediaList?: Array<SocialMediaItem>;
  [key: string]: any;
} = {
  networkTypeV2: 'TESTNET',
  networkType: 'TESTNET',
  connectUrlV2: 'https://auth-aa-portkey-test.portkey.finance',
  portkeyServerV2: 'https://aa-portkey-test.portkey.finance',
  graphqlServerV2: 'https://dapp-aa-portkey-test.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql',
  curChain: 'tDVW',
  rpcUrlAELF: 'https://aelf-test-node.aelf.io',
  rpcUrlTDVW: 'https://tdvw-test-node.aelf.io',
  rpcUrlTDVV: 'https://tdvw-test-node.aelf.io',
  socialMediaList: [
    {
      index: 1,
      icon: '',
      link: 'https://github.com/',
      target: '',
      name: 'twitter',
    },
    {
      index: 2,
      icon: '',
      link: 'https://github.com/',
      target: '',
      name: 'discard',
    },
    {
      index: 3,
      icon: '',
      link: 'https://github.com/',
      target: '',
      name: 'gitbook',
    },
    {
      index: 4,
      icon: '',
      link: 'https://github.com/',
      target: '',
      name: 'telegram',
    },
    {
      index: 5,
      icon: '',
      link: 'https://github.com/',
      target: '',
      name: 'linktree',
    },
  ],
  openTimeStamp: '1710028800000',
};
