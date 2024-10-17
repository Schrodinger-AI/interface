import { useCallback } from 'react';
import { message } from 'antd';
import useDiscoverProvider from './useDiscoverProvider';
import { IContractError } from 'types';
import { formatErrorMsg } from 'utils/formatError';
import { appName } from 'constants/common';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

const AElf = require('aelf-sdk');

export const useGetSignature = () => {
  const { isConnected, walletInfo, getSignature, walletType } = useConnectWallet();
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const getSignInfo: (signString?: string) => Promise<
    | {
        signature: string;
        publicKey: string;
      }
    | undefined
  > = useCallback(
    async (signString) => {
      if (!isConnected) return;
      const timestamp = Date.now();

      const signStr = signString || `${walletInfo?.address}-${timestamp}`;
      const hexData = Buffer.from(signStr).toString('hex');
      const signInfo = AElf.utils.sha256(signStr);

      let publicKey = '';
      let signature = '';

      if (walletType === WalletTypeEnum.discover) {
        try {
          const { pubKey, signatureStr } = await getSignatureAndPublicKey(hexData, signInfo);
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
          appName,
          address: walletInfo?.address || '',
          signInfo:
            walletType === WalletTypeEnum.aa
              ? Buffer.from(signString || `${walletInfo?.address}-${timestamp}`).toString('hex')
              : signInfo,
        });
        if (sign?.errorMessage) {
          const errorMessage = formatErrorMsg(sign?.errorMessage as unknown as IContractError).errorMessage.message;
          message.error(errorMessage);
          return;
        }

        publicKey = walletInfo?.extraInfo?.publicKey || '';
        signature = sign?.signature || '';
      }
      return {
        signature,
        publicKey,
      };
    },
    [
      isConnected,
      walletInfo?.address,
      walletInfo?.extraInfo?.publicKey,
      walletType,
      getSignatureAndPublicKey,
      getSignature,
    ],
  );

  return { getSignInfo };
};
