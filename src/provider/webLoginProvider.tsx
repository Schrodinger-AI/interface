'use client';
import { ChainId, NetworkType } from '@portkey/provider-types';
import { devicesEnv } from '@portkey/utils';
import type { ExtraWalletNames } from 'aelf-web-login';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { store } from 'redux/store';

const APP_NAME = 'schrodinger';

const PortkeyProviderDynamic = dynamic(
  async () => {
    const weblogin = await import('aelf-web-login').then((module) => module);
    return weblogin.PortkeyProvider;
  },
  { ssr: false },
) as any;

const WebLoginProviderDynamic = dynamic(
  async () => {
    const cmsInfo = store.getState().info.cmsInfo;
    const serverV2 = cmsInfo?.portkeyServerV2;
    const connectUrlV2 = cmsInfo?.connectUrlV2;
    const telegramBotId = cmsInfo?.telegramBotId;
    // const telegramBotId = '7201394060';

    const webLogin = await import('aelf-web-login').then((module) => module);

    webLogin.setGlobalConfig({
      onlyShowV2: true,
      appName: APP_NAME,
      chainId: cmsInfo?.curChain || '',
      portkey: {},
      portkeyV2: {
        networkType: (cmsInfo?.networkTypeV2 || 'TESTNET') as NetworkType,
        useLocalStorage: true,
        graphQLUrl: cmsInfo?.graphqlServerV2,
        connectUrl: connectUrlV2 || '',
        requestDefaults: {
          timeout: cmsInfo?.networkTypeV2 === 'TESTNET' ? 300000 : 80000,
          baseURL: serverV2 || '',
        },
        serviceUrl: serverV2,
        socialLogin: {
          Telegram: {
            botId: telegramBotId,
          },
        },
        loginConfig: {
          recommendIndexes: [0, 1],
          loginMethodsOrder: ['Google', 'Apple', 'Telegram', 'Email'],
        },
        referralInfo: {
          referralCode: '',
          projectCode: '13015',
        },
      },
      aelfReact: {
        appName: APP_NAME,
        nodes: {
          AELF: {
            chainId: 'AELF',
            rpcUrl: cmsInfo?.rpcUrlAELF as unknown as string,
          },
          tDVW: {
            chainId: 'tDVW',
            rpcUrl: cmsInfo?.rpcUrlTDVW as unknown as string,
          },
          tDVV: {
            chainId: 'tDVV',
            rpcUrl: cmsInfo?.rpcUrlTDVV as unknown as string,
          },
        },
      },
      defaultRpcUrl:
        (cmsInfo?.[`rpcUrl${String(cmsInfo.curChain).toUpperCase()}`] as string) || cmsInfo?.rpcUrlTDVW || '',
      networkType: (cmsInfo?.networkType as 'TESTNET' | 'MAIN') || 'TESTNET',
    });
    return webLogin.WebLoginProvider;
  },
  { ssr: false },
);

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ children }: { children: React.ReactNode }) => {
  const cmsInfo = store.getState().info.cmsInfo;
  const [extraWallets, setExtraWallets] = useState<{ extraWallets?: ExtraWalletNames[] }>({});

  const getExtraWallets = useCallback(async () => {
    const app = await devicesEnv.getPortkeyShellApp();
    app ? setExtraWallets({}) : setExtraWallets({ extraWallets: ['discover', 'elf'] });
  }, []);

  useEffect(() => {
    getExtraWallets();
  }, [getExtraWallets]);

  return (
    <PortkeyProviderDynamic networkType={cmsInfo?.networkType} networkTypeV2={cmsInfo?.networkTypeV2}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: true,
          connectEagerly: true,
        }}
        portkey={{
          autoShowUnlock: false,
          checkAccountInfoSync: true,
          design: 'CryptoDesign',
          keyboard: {
            v2: true,
          },
        }}
        {...extraWallets}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
        }}>
        {children}
      </WebLoginProviderDynamic>
    </PortkeyProviderDynamic>
  );
};
