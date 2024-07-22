'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { metaMaskWallet, okxWallet, phantomWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { APP_NAME, PROJECT_ID, APP_NAME_TEST, PROJECT_ID_TEST } from 'constants/connectEvmWalletConfig';
import { ENVIRONMENT } from 'constants/url';
import useTelegram from 'hooks/useTelegram';

function ConnectEvmWalletProvider({ children }: { children: React.ReactNode }) {
  const { isInTelegram } = useTelegram();
  const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [walletConnectWallet, metaMaskWallet, okxWallet, phantomWallet],
      },
    ],
    {
      appName: env === ENVIRONMENT.TEST ? APP_NAME_TEST : APP_NAME,
      projectId: env === ENVIRONMENT.TEST ? PROJECT_ID_TEST : PROJECT_ID,
    },
  );

  const wagmiConfig = createConfig({
    chains: [mainnet, polygon, optimism, arbitrum, base, zora],
    connectors,
  } as any);

  const queryClient = new QueryClient();

  if (isInTelegram()) {
    return <>{children}</>;
  } else {
    return (
      <>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider locale="en-US">{children}</RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </>
    );
  }
}

export default ConnectEvmWalletProvider;
