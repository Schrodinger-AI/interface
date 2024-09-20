'use client';

import React, { useEffect } from 'react';
import { ETransferConfig, ETransferLayoutProvider, ETransferStyleProvider } from '@etransfer/ui-react';
import '@etransfer/ui-react/dist/assets/index.css';
import { useCmsInfo } from 'redux/hooks';

export default function ETransferLayout({ children }: { children: React.ReactNode }) {
  const cmsInfo = useCmsInfo();
  useEffect(() => {
    ETransferConfig.setConfig({
      networkType: cmsInfo?.etransferConfig.networkType,
      etransferUrl: cmsInfo?.etransferConfig.etransferUrl,
      etransferAuthUrl: cmsInfo?.etransferConfig.etransferAuthUrl,
      etransferSocketUrl: cmsInfo?.etransferConfig.etransferSocketUrl,
    });
  }, [
    cmsInfo?.etransferConfig.etransferAuthUrl,
    cmsInfo?.etransferConfig.etransferSocketUrl,
    cmsInfo?.etransferConfig.etransferUrl,
    cmsInfo?.etransferConfig.networkType,
  ]);

  return (
    <ETransferStyleProvider>
      <ETransferLayoutProvider>{children}</ETransferLayoutProvider>
    </ETransferStyleProvider>
  );
}
