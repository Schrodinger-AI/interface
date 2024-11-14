module.exports = [
  { source: '/api/:path*', destination: 'https://schrodingernft.ai/api/:path*' },
  { source: '/cms/:path*', destination: 'https://schrodingernft.ai/cms/:path*' },
  {
    source: '/schrodingerGQL/:path*',
    destination:
      'https://indexer.schrodingernft.ai/SchrodingerIndexer_DApp/SchrodingerIndexerPluginSchema/graphql/:path*',
  },
  {
    source: '/forestGQL/:path*',
    destination: 'https://indexer-api.aefinder.io/api/app/graphql/forest/:path*',
  },
  { source: '/connect/:path*', destination: 'https://schrodingernft.ai/connect/:path*' },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/:path*',
  },
  { source: '/portkey/api/:path*', destination: 'https://did-portkey-test.portkey.finance/api/:path*' },
];
