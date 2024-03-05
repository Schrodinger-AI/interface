module.exports = [
  { source: '/api/:path*', destination: 'http://192.168.10.52:8068/api/:path*' },
  { source: '/cms/:path*', destination: 'https://test.eforest.finance/cms/:path*' },
  { source: '/connect/:path*', destination: 'http://192.168.10.52:8080/connect/:path*' },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/:path*',
  },
  { source: '/portkey/api/:path*', destination: 'https://did-portkey-test.portkey.finance/api/:path*' },
];
