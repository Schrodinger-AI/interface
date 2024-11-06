import { useCallback } from 'react';
import { did } from '@portkey/did-ui-react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { ETransferConfig, etransferCore } from '@etransfer/ui-react';
import { AuthTokenSource, PortkeyVersion } from '@etransfer/types';
import { getCaInfo } from 'utils/getCaInfo';
import { getETransferJWT, recoverPubKeyBySignature } from '@etransfer/utils';

import useDiscoverProvider from './useDiscoverProvider';
import { asyncStorage } from 'utils/lib';
import AElf from 'aelf-sdk';
import { appName } from 'constants/common';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { TSignatureParams, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { useCmsInfo } from 'redux/hooks';

export function useETransferAuthToken() {
  const { isLogin } = useGetLoginStatus();
  const { discoverProvider } = useDiscoverProvider();
  const { getSignature: getSignatureWeb, walletType, walletInfo, callSendMethod, getSignature } = useConnectWallet();
  // const { getSignInfo } = useGetSignature();
  const cmsInfo = useCmsInfo();

  const getManagerAddress = useCallback(async () => {
    let managerAddress;
    if (walletType === WalletTypeEnum.discover) {
      if (!discoverProvider) throw new Error('Please download extension');
      const provider = await discoverProvider();
      managerAddress = provider?.request({ method: 'wallet_getCurrentManagerAddress' });
    } else if (walletType === WalletTypeEnum.aa) {
      managerAddress = did.didWallet.managementAccount?.address;
    }
    if (managerAddress) return managerAddress;
    throw new Error('Please Login');
  }, [discoverProvider, walletType]);

  const getDiscoverSignature = useCallback(
    async (
      params: TSignatureParams & {
        plainTextOrigin?: string;
      },
    ) => {
      const provider = await discoverProvider();
      const signInfo = params.signInfo;

      const hexData = params.plainTextOrigin ? Buffer.from(params.plainTextOrigin).toString('hex') : '';

      const isSupportManagerSignature = (provider as any).methodCheck('wallet_getManagerSignature') && hexData;

      const signedMsgObject = await provider?.request({
        method: isSupportManagerSignature ? 'wallet_getManagerSignature' : 'wallet_getSignature',
        payload: isSupportManagerSignature
          ? { hexData }
          : {
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

  const getPortKeySignature = useCallback(async (params: TSignatureParams) => {
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
    if (walletType === WalletTypeEnum.discover) {
      // discover
      signInfo = AElf.utils.sha256(plainText);
      getSignature = getDiscoverSignature;
      address = walletInfo?.address || '';
    } else if (walletType === WalletTypeEnum.elf) {
      // nightElf
      signInfo = AElf.utils.sha256(plainText);
      getSignature = getSignatureWeb;
      address = walletInfo?.address || '';
    } else {
      // portkey sdk
      signInfo = Buffer.from(plainText).toString('hex');
      getSignature = getPortKeySignature;
      address = walletInfo?.address || '';
    }
    const result = await getSignature({
      appName: appName,
      address,
      signInfo,
      plainTextOrigin,
    });
    if (result?.error) throw result.errorMessage;

    return { signature: result?.signature || '', plainText };
  }, [getDiscoverSignature, getPortKeySignature, getSignatureWeb, walletInfo?.address, walletType]);

  const getUserInfo = useCallback(
    async ({ managerAddress }: { managerAddress: string }) => {
      const signatureResult = await handleGetSignature();
      const pubkey = recoverPubKeyBySignature(signatureResult.plainText, signatureResult.signature) + '';
      return {
        pubkey,
        signature: signatureResult.signature,
        plainText: signatureResult.plainText,
        managerAddress: managerAddress,
      };
    },
    [handleGetSignature],
  );

  const getETransferAuthToken = useCallback(async () => {
    if (!walletInfo || !walletInfo?.address) throw new Error('Failed to obtain walletInfo information.');
    if (!isLogin) throw new Error('You are not logged in.');

    try {
      const isNightELF = walletType === WalletTypeEnum.elf;
      const managerAddress = isNightELF ? walletInfo?.address || '' : await getManagerAddress();
      const { caHash, originChainId } = await getCaInfo({
        walletType,
        address: walletInfo?.address,
        walletInfo: walletInfo,
      });
      let authToken;
      const jwtData = await getETransferJWT(
        asyncStorage,
        isNightELF ? `nightElf${managerAddress}` : `${caHash}${managerAddress}`,
      );
      if (jwtData) {
        authToken = `${jwtData.token_type} ${jwtData.access_token}`;
      } else {
        const { pubkey, signature, plainText } = await getUserInfo({ managerAddress });
        const recaptchaToken = isNightELF ? await etransferCore.getReCaptcha(walletInfo?.address || '') : undefined;

        const params = {
          pubkey,
          signature,
          plainText,
          caHash,
          chainId: originChainId,
          managerAddress,
          version: PortkeyVersion.v2,
          source: isNightELF ? AuthTokenSource.NightElf : AuthTokenSource.Portkey,
          recaptchaToken,
        };
        authToken = await etransferCore.getAuthToken(params);
      }

      ETransferConfig.setConfig({
        accountInfo: {
          accounts: {
            AELF: addPrefixSuffix(walletInfo?.address || '', 'AELF'),
            [cmsInfo?.curChain || 'tDVV']: addPrefixSuffix(walletInfo?.address || '', cmsInfo?.curChain || 'tDVV'),
          },
          walletType,
          managerAddress: managerAddress,
          caHash: caHash,
          tokenContractCallSendMethod: (params) => {
            const paramsFormat: any = params;
            paramsFormat.args['networkType'] = ETransferConfig.getConfig('networkType');
            return callSendMethod(params);
          },
          getSignature: (signInfo) =>
            getSignature({
              signInfo,
              appName: appName,
              address: walletInfo.address,
            }),
        },
        authorization: {
          jwt: authToken,
        },
      });
      return authToken;
    } catch (error) {
      console.log('=====getETransferAuthToken error', error);
      throw error;
    }
  }, [
    callSendMethod,
    cmsInfo?.curChain,
    getManagerAddress,
    getSignature,
    getUserInfo,
    isLogin,
    walletInfo,
    walletType,
  ]);

  return { getETransferAuthToken };
}
