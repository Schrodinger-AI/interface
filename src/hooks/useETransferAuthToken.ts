import { useCallback } from 'react';
import { useWalletService } from './useWallet';
import { SignatureParams, WalletType } from 'aelf-web-login';
import { did } from '@portkey/did-ui-react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { ETransferConfig } from '@etransfer/ui-react';
import { eTransferCore } from '@etransfer/core';
import { AuthTokenSource, PortkeyVersion } from '@etransfer/types';
import { getCaInfo } from 'utils/getCaInfo';
import { getETransferJWT, recoverPubKeyBySignature } from '@etransfer/utils';

import useDiscoverProvider from './useDiscoverProvider';
import { asyncStorage } from 'utils/lib';
import AElf from 'aelf-sdk';
import { ChainId } from '@portkey/provider-types';

export function useETransferAuthToken() {
  const { wallet, walletType } = useWalletService();
  const { isLogin } = useGetLoginStatus();
  const { discoverProvider } = useDiscoverProvider();

  const getManagerAddress = useCallback(async () => {
    let managerAddress;
    if (walletType === WalletType.discover) {
      if (!discoverProvider) throw new Error('Please download extension');
      const provider = await discoverProvider();
      managerAddress = provider?.request({ method: 'wallet_getCurrentManagerAddress' });
    } else if (walletType === WalletType.portkey) {
      managerAddress = did.didWallet.managementAccount?.address;
    }
    if (managerAddress) return managerAddress;
    throw new Error('Please Login');
  }, [discoverProvider, walletType]);

  const getDiscoverSignature = useCallback(
    async (params: SignatureParams) => {
      const provider = await discoverProvider();
      const signInfo = params.signInfo;
      const signedMsgObject = await provider?.request({
        method: 'wallet_getSignature',
        payload: {
          data: signInfo || params.hexToBeSign,
        },
      });
      const signedMsgString = [
        signedMsgObject?.r.toString(16, 64),
        signedMsgObject?.s.toString(16, 64),
        `0${signedMsgObject?.recoveryParam.toString()}`,
      ].join('');
      return {
        error: 0,
        errorMessage: '',
        signature: signedMsgString,
        from: 'discover',
      };
    },
    [discoverProvider],
  );

  const getPortKeySignature = useCallback(async (params: SignatureParams) => {
    // checkSignatureParams(params);
    let signInfo = '';
    if (params.hexToBeSign) {
      signInfo = params.hexToBeSign;
    } else {
      signInfo = params.signInfo;
    }
    const signature = did.sign(signInfo).toString('hex');
    return {
      error: 0,
      errorMessage: '',
      signature,
      from: 'portkey',
    };
  }, []);

  const handleGetSignature = useCallback(async () => {
    const plainTextOrigin = `Nonce:${Date.now()}`;
    const plainText: any = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    let signInfo: string;
    let getSignature;
    let address: string;
    if (walletType !== WalletType.portkey) {
      // nightElf or discover
      signInfo = AElf.utils.sha256(plainText);
      getSignature = getDiscoverSignature;
      address = wallet.address || '';
    } else {
      // portkey sdk
      signInfo = Buffer.from(plainText).toString('hex');
      getSignature = getPortKeySignature;
      address = wallet.address || '';
    }
    const result = await getSignature({
      appName: 'Hamster Woods',
      address,
      signInfo,
    });
    if (result.error) throw result.errorMessage;

    return { signature: result?.signature || '', plainText };
  }, [getDiscoverSignature, getPortKeySignature, wallet.address, walletType]);

  const getUserInfo = useCallback(
    async ({
      managerAddress,
      caHash,
      originChainId,
    }: {
      managerAddress: string;
      caHash: string;
      originChainId: ChainId;
    }) => {
      const signatureResult = await handleGetSignature();
      const pubkey = recoverPubKeyBySignature(signatureResult.plainText, signatureResult.signature) + '';
      return {
        pubkey,
        signature: signatureResult.signature,
        plainText: signatureResult.plainText,
        caHash,
        originChainId,
        managerAddress: managerAddress,
      };
    },
    [handleGetSignature],
  );

  const getETransferAuthToken = useCallback(async () => {
    if (!wallet) throw new Error('Failed to obtain walletInfo information.');
    if (!isLogin) throw new Error('You are not logged in.');

    try {
      const managerAddress = await getManagerAddress();
      const { caHash, originChainId } = await getCaInfo({
        walletType,
        address: wallet.address,
      });
      let authToken;
      const jwtData = await getETransferJWT(asyncStorage, `${caHash}${managerAddress}`);
      console.log('=====getETransferAuthToken jwtData', jwtData);
      if (jwtData) {
        authToken = `${jwtData.token_type} ${jwtData.access_token}`;
      } else {
        const { pubkey, signature, plainText } = await getUserInfo({ managerAddress, caHash, originChainId });
        let params;
        if (walletType === WalletType.elf) {
          const recaptchaToken = await eTransferCore.getReCaptcha(wallet.address);
          params = {
            pubkey,
            signature,
            plainText,
            managerAddress: wallet.address,
            version: PortkeyVersion.v2,
            source: AuthTokenSource.NightElf,
            recaptchaToken: recaptchaToken,
          };
        } else {
          params = {
            pubkey,
            signature,
            plainText,
            caHash,
            chainId: originChainId,
            managerAddress,
            version: PortkeyVersion.v2,
            source: AuthTokenSource.Portkey,
            recaptchaToken: undefined,
          };
        }
        console.log('=====getETransferAuthToken params', params);
        authToken = await eTransferCore.getAuthToken(params);

        console.log('=====getETransferAuthToken authToken', authToken);
      }

      ETransferConfig.setConfig({
        authorization: {
          jwt: authToken,
        },
      });
      return authToken;
    } catch (error) {
      console.log('=====getETransferAuthToken error', error);
      throw error;
    }
  }, [getManagerAddress, getUserInfo, isLogin, wallet, walletType]);

  return { getETransferAuthToken };
}
