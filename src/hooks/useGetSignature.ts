import { useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { useCallback, useMemo } from 'react';
import { message } from 'antd';
import useDiscoverProvider from './useDiscoverProvider';
import { IContractError } from 'types';
import { formatErrorMsg } from 'utils/formatError';

const AElf = require('aelf-sdk');

export const useGetSignature = () => {
  const { loginState, wallet, getSignature, walletType } = useWebLogin();
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const getSignInfo: (signString?: string) => Promise<
    | {
        signature: string;
        publicKey: string;
      }
    | undefined
  > = useCallback(
    async (signString) => {
      if (loginState !== WebLoginState.logined) return;
      const timestamp = Date.now();

      const signInfo = AElf.utils.sha256(signString || `${wallet.address}-${timestamp}`);

      let publicKey = '';
      let signature = '';

      if (walletType === WalletType.discover) {
        try {
          const { pubKey, signatureStr } = await getSignatureAndPublicKey(signInfo);
          publicKey = pubKey || '';
          signature = signatureStr || '';
        } catch (error) {
          const resError = error as IContractError;
          const errorMessage = formatErrorMsg(resError).errorMessage.message;
          message.error(errorMessage);
          return;
        }
      } else {
        const sign = await getSignature({
          appName: 'schrodinger',
          address: wallet.address,
          signInfo:
            walletType === WalletType.portkey
              ? Buffer.from(signString || `${wallet.address}-${timestamp}`).toString('hex')
              : signInfo,
        });
        if (sign?.errorMessage) {
          const errorMessage = formatErrorMsg(sign?.errorMessage as unknown as IContractError).errorMessage.message;
          message.error(errorMessage);
          return;
        }

        publicKey = wallet.publicKey || '';
        signature = sign.signature;
      }
      return {
        signature,
        publicKey,
      };
    },
    [loginState, wallet.address, wallet.publicKey, walletType, getSignatureAndPublicKey, getSignature],
  );

  return { getSignInfo };
};
