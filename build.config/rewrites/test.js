module.exports = [
  { source: '/api/:path*', destination: 'https://sgr.schrodingerai.com/api/:path*' },
  { source: '/cms/:path*', destination: 'https://sgr.schrodingerai.com/cms/:path*' },
  {
    source: '/schrodingerGQL/:path*',
    destination:
      'https://test-indexer.schrodingerai.com/SchrodingerIndexer_DApp/SchrodingerIndexerPluginSchema/graphql/:path*',
  },
  {
    source: '/forestGQL/:path*',
    destination: 'https://test-indexer.eforest.finance/AElfIndexer_Forest/ForestIndexerPluginSchema/graphql/:path*',
  },
  { source: '/connect/:path*', destination: 'https://sgr.schrodingerai.com/connect/:path*' },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/:path*',
  },
  { source: '/portkey/api/:path*', destination: 'https://did-portkey-test.portkey.finance/api/:path*' },
];
