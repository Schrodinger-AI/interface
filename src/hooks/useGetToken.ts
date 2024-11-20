import { useCallback } from 'react';
import { storages } from 'constants/storages';
import { fetchToken } from 'api/request';
import { message } from 'antd';
import useDiscoverProvider from './useDiscoverProvider';
import { useCheckJoined } from './useJoin';
import { sleep } from '@portkey/utils';
import useLoading from './useLoading';
import { IContractError } from 'types';
import { formatErrorMsg, LoginFailed } from 'utils/formatError';
import { resetLoginStatus, setLoginStatus } from 'redux/reducer/loginStatus';
import { store } from 'redux/store';
import { appName } from 'constants/common';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

const AElf = require('aelf-sdk');
const hexDataCopywriter = `Welcome to Schrodinger! Click to sign in to the world's first AI-powered 404 NFT platform! This request will not trigger any blockchain transaction or cost any gas fees.

signature: `;

export const useGetToken = () => {
  const { walletInfo, walletType, disConnectWallet, getSignature, isConnected } = useConnectWallet();
  const { showLoading, closeLoading } = useLoading();
  const { getSignatureAndPublicKey } = useDiscoverProvider();
  const { checkJoined } = useCheckJoined();

  const getTokenFromServer: (props: {
    params: ITokenParams;
    needLoading?: boolean;
    retryCount?: number;
  }) => Promise<string | undefined> = useCallback(
    async (props: { params: ITokenParams; needLoading?: boolean; retryCount?: number }) => {
      const { params, needLoading = false, retryCount = 3 } = props;
      needLoading && showLoading();
      try {
        const res = await fetchToken(params);
        needLoading && closeLoading();
        if (isConnected && walletInfo) {
          store.dispatch(
            setLoginStatus({
              hasToken: true,
              isLogin: true,
            }),
          );
          localStorage.setItem(
            storages.accountInfo,
            JSON.stringify({
              account: walletInfo?.address || '',
              token: res.access_token,
              expirationTime: Date.now() + res.expires_in * 1000,
            }),
          );
          return res.access_token;
        } else {
          message.error(LoginFailed);
          console.log('=====token error no connect');
          store.dispatch(resetLoginStatus());
          return '';
        }
      } catch (error) {
        if (retryCount) {
          await sleep(1000);
          const retry = retryCount - 1;
          getTokenFromServer({
            ...props,
            retryCount: retry,
          });
        } else {
          message.error(LoginFailed);
          console.log('=====token error', error);
          isConnected && disConnectWallet();
          needLoading && closeLoading();
          return '';
        }
      }
    },
    [closeLoading, disConnectWallet, isConnected, showLoading, walletInfo],
  );

  const checkTokenValid = useCallback(() => {
    if (!isConnected) return false;
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');

    if (accountInfo?.token && Date.now() < accountInfo?.expirationTime && accountInfo.account === walletInfo?.address) {
      return true;
    } else {
      return false;
    }
  }, [isConnected, walletInfo?.address]);

  const getToken: (params?: { needLoading?: boolean }) => Promise<undefined | string> = useCallback(
    async (params?: { needLoading?: boolean }) => {
      const { needLoading } = params || {};
      if (!isConnected || !walletInfo || !walletInfo?.address) return;

      if (checkTokenValid()) {
        checkJoined(walletInfo.address);
        return;
      } else {
        localStorage.removeItem(storages.accountInfo);
      }
      const timestamp = Date.now();

      // const signInfo = AElf.utils.sha256(`${walletInfo.address}-${timestamp}`);

      const signStr = `${walletInfo.address}-${timestamp}`;
      const hexDataStr = hexDataCopywriter + signStr;
      const hexData = Buffer.from(hexDataStr).toString('hex');
      const portkeyHexData = Buffer.from(signStr).toString('hex');
      const signInfo = AElf.utils.sha256(signStr);

      let publicKey = '';
      let signature = '';
      let source = '';

      if (walletType === WalletTypeEnum.discover) {
        try {
          const { pubKey, signatureStr } = await getSignatureAndPublicKey(hexData, signInfo);
          publicKey = pubKey || '';
          signature = signatureStr || '';
          source = 'portkey';
        } catch (error) {
          const resError = error as IContractError;
          const errorMessage = formatErrorMsg(resError).errorMessage.message;
          message.error(errorMessage);
          isConnected && disConnectWallet();
          return;
        }
      } else {
        const sign = await getSignature({
          appName,
          address: walletInfo?.address,
          signInfo: walletType === WalletTypeEnum.aa ? portkeyHexData : signInfo,
        });
        if (sign?.errorMessage) {
          const errorMessage = formatErrorMsg(sign?.errorMessage as unknown as IContractError).errorMessage.message;
          message.error(errorMessage);
          isConnected && disConnectWallet();
          return;
        }

        publicKey = walletInfo?.extraInfo?.publicKey || '';
        signature = sign?.signature || '';
        if (walletType === WalletTypeEnum.elf) {
          source = 'nightElf';
        } else {
          source = 'portkey';
        }
      }
      if (!publicKey) return;
      const res = await getTokenFromServer({
        params: {
          grant_type: 'signature',
          scope: 'SchrodingerServer',
          client_id: 'SchrodingerServer_App',
          timestamp,
          signature,
          source,
          publickey: publicKey,
          address: walletInfo?.address,
        } as ITokenParams,
        needLoading,
      });

      checkJoined(walletInfo?.address);
      return res;
    },
    [
      isConnected,
      walletInfo,
      checkTokenValid,
      walletType,
      getTokenFromServer,
      checkJoined,
      getSignatureAndPublicKey,
      disConnectWallet,
      getSignature,
    ],
  );

  return { getToken, checkTokenValid };
};
