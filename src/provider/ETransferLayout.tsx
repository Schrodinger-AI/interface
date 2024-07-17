'use client';

import React, { useEffect } from 'react';
import { ETransferConfig, ETransferLayoutProvider, ETransferStyleProvider } from '@etransfer/ui-react';
import '@etransfer/ui-react/dist/assets/index.css';

export default function ETransferLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // TODO use cms config
    ETransferConfig.setConfig({
      depositConfig: {
        defaultDepositToken: 'USDT',
        defaultReceiveToken: 'SGR',
        defaultChainId: 'tDVW',
        defaultNetwork: 'TRX',
        supportNetworks: ['SETH', 'TRX', 'BSC'],
      },
      authorization: {
        jwt: '', // ETransfer Auth Token
      },
      networkType: 'TESTNET',
      etransferUrl: 'https://test-app.etransfer.exchange',
      etransferAuthUrl: 'https://test-app.etransfer.exchange',
    });
  }, []);
  return (
    <ETransferStyleProvider>
      <ETransferLayoutProvider>{children}</ETransferLayoutProvider>
    </ETransferStyleProvider>
  );
}
