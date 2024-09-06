import { getChainInfo, managerApprove, NetworkType } from '@portkey/did-ui-react';
import { useCallback, useEffect, useRef } from 'react';
import { aelf } from '@portkey/utils';
import { getContractBasic } from '@portkey/contracts';
import { appName, PORTKEY_LOGIN_CHAIN_ID_KEY } from 'constants/common';
import { ChainId } from '@portkey/types';
import { TTokenApproveHandler } from '@portkey/trader-core';
import { useAElfReact } from '@aelf-react/core';
import { AElfContextType } from '@aelf-react/core/dist/types';
import { useWalletService } from 'hooks/useWallet';
import { useCmsInfo } from 'redux/hooks';
import { WalletType } from 'aelf-web-login';
import { getRpcUrls } from 'constants/url';

export default function useSwapService() {
  const { walletType, wallet } = useWalletService();
  const cmsInfo = useCmsInfo();
  const { curChain, networkTypeV2 } = cmsInfo || {};
  const aelfReact = useAElfReact();
  const aelfReactInstanceRef = useRef<AElfContextType>();
  const discoverProviderInstanceRef = useRef<any>();

  useEffect(() => {
    aelfReactInstanceRef.current = aelfReact;
  }, [aelfReact]);

  useEffect(() => {
    discoverProviderInstanceRef.current = wallet.discoverInfo?.provider;
  }, [wallet.discoverInfo?.provider]);

  const getOptions: any = useCallback(async () => {
    if (walletType === WalletType.unknown) throw 'unknown';
    if (walletType === WalletType.portkey) {
      if (!wallet.portkeyInfo) throw 'no managementAccount';
      const caHash = wallet.portkeyInfo.caInfo.caHash || '';
      const chainInfo = await getChainInfo(curChain);
      return {
        contractOptions: {
          account: aelf.getWallet(wallet.portkeyInfo.walletInfo.privateKey || ''),
          callType: 'ca' as any,
          caHash,
          caContractAddress: chainInfo.caContractAddress,
        },
        address: wallet.portkeyInfo.caInfo.caAddress || '',
      };
    } else if (walletType === WalletType.discover) {
      const provider = discoverProviderInstanceRef.current;
      if (!provider) return;
      const chainProvider = await provider.getChain(curChain);
      const accountsResult = await provider.request({ method: 'requestAccounts' });
      const caAddress = accountsResult[curChain!]?.[0];
      return { contractOptions: { chainProvider }, address: caAddress };
    } else {
      const provider = await aelfReactInstanceRef.current?.activate({
        [curChain || 'tDVV']: {
          rpcUrl: getRpcUrls()[curChain || 'tDVV'] || '',
          chainId: curChain!,
        },
      });
      const bridge = provider?.[curChain!];
      if (!bridge) return;
      const loginInfo = await bridge.login({ chainId: curChain!, payload: { method: 'LOGIN' } });
      await bridge.chain.getChainStatus();
      const address = JSON.parse(loginInfo?.detail ?? '{}').address;
      return {
        contractOptions: {
          aelfInstance: bridge,
          account: {
            address: address,
          },
        },
        address,
      };
    }
  }, [curChain, wallet.portkeyInfo, walletType]);

  const tokenApprove: TTokenApproveHandler = useCallback(
    async (params) => {
      const originChainId = (localStorage.getItem(PORTKEY_LOGIN_CHAIN_ID_KEY) || curChain) as ChainId;
      const caHash = wallet.portkeyInfo?.caInfo.caHash || '';
      const chainInfo = await getChainInfo(curChain);

      const [portkeyContract] = await Promise.all(
        [chainInfo.caContractAddress, chainInfo.defaultToken.address].map((ca) =>
          getContractBasic({
            contractAddress: ca,
            account: aelf.getWallet(wallet.portkeyInfo?.walletInfo.privateKey || ''),
            rpcUrl: chainInfo.endPoint,
          }),
        ),
      );

      const result = await managerApprove({
        originChainId: originChainId,
        symbol: params.symbol,
        caHash,
        amount: params.amount,
        spender: params.spender,
        targetChainId: curChain!,
        networkType: networkTypeV2 as NetworkType,
        dappInfo: {
          name: appName,
        },
      });
      console.log('result===', result);

      const approveResult = await portkeyContract.callSendMethod('ManagerApprove', '', {
        caHash,
        spender: params.spender,
        symbol: result.symbol,
        amount: result.amount,
        guardiansApproved: result.guardiansApproved,
      });
      if (approveResult.error) throw approveResult.error;
    },
    [curChain, networkTypeV2, wallet.portkeyInfo?.caInfo.caHash, wallet.portkeyInfo?.walletInfo.privateKey],
  );

  return {
    getOptions,
    tokenApprove,
  };
}
