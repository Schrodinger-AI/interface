import AElf from 'aelf-sdk';
import { Approve, GetAvailableAllowance } from 'contract/multiToken';
import { message } from 'antd';
import { DEFAULT_ERROR } from './formatError';
import { timesDecimals } from './calculate';
import BigNumber from 'bignumber.js';
import { IContractError } from 'types';
import { CONTRACT_AMOUNT } from 'constants/common';
import { MethodType, SentryMessageType, captureMessage } from './captureMessage';
import { IPortkeyProvider, MethodsBase } from '@portkey/provider-types';
import detectProvider from '@portkey/detect-provider';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

export default async function detectDiscoverProvider(): Promise<IPortkeyProvider | null> {
  let detectProviderFunc = detectProvider;
  if (typeof detectProvider !== 'function') {
    const detectProviderModule = detectProvider as any;
    detectProviderFunc = detectProviderModule.default;
  }
  try {
    const res = await detectProviderFunc({
      timeout: 6000,
      providerName: 'Portkey',
    });
    return res;
  } catch (e) {
    console.log('detectDiscoverProvider error', e);
    return null;
  }
}
const httpProviders: any = {};
export function getAElf(rpcUrl?: string) {
  const rpc = rpcUrl || '';
  if (!httpProviders[rpc]) {
    httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  }
  return httpProviders[rpc];
}

const openBatchApprovalEntrance = async (walletType: WalletTypeEnum) => {
  try {
    if (walletType === WalletTypeEnum.discover) {
      const discoverProvider = async () => {
        const provider: IPortkeyProvider | null = await detectDiscoverProvider();
        if (provider) {
          if (!provider.isPortkey) {
            throw new Error('Discover provider found, but check isPortkey failed');
          }
          return provider;
        } else {
          return null;
        }
      };
      const provider = await discoverProvider();
      if (!provider) return null;
      await provider.request({
        method: MethodsBase.SET_WALLET_CONFIG_OPTIONS,
        payload: { batchApproveNFT: true },
      });
    }
  } catch (error) {
    /* empty */
  }
};

export const approve = async (spender: string, symbol: string, amount: string, chainId?: Chain) => {
  try {
    const approveResult = await Approve(
      {
        spender: spender,
        symbol,
        amount: Number(amount),
        batchApproveNFT: true,
      },
      {
        chain: chainId,
      },
    );
    if (approveResult.error) {
      message.error(approveResult?.errorMessage?.message || DEFAULT_ERROR);
      captureMessage({
        type: SentryMessageType.CONTRACT,
        params: {
          name: 'approve',
          method: MethodType.CALLSENDMETHOD,
          query: {
            spender: spender,
            symbol,
            amount: Number(amount),
          },
          description: approveResult,
        },
      });
      return false;
    }

    // const { TransactionId } = approveResult.result || approveResult;

    // if (chainId) {
    //   await MessageTxToExplore(TransactionId!, chainId);
    // }

    return true;
  } catch (error) {
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
    }
    captureMessage({
      type: SentryMessageType.CONTRACT,
      params: {
        name: 'approve error',
        method: MethodType.CALLSENDMETHOD,
        query: {
          spender: spender,
          symbol,
          amount: Number(amount),
        },
        description: error,
      },
    });
    return false;
  }
};

export const checkAllowanceAndApprove = async (options: {
  spender: string;
  address: string;
  chainId?: Chain;
  symbol?: string;
  decimals?: number;
  amount: string;
  walletType: WalletTypeEnum;
}) => {
  const { chainId, symbol = 'ELF', address, spender, amount, decimals = 8 } = options;
  try {
    const allowance = await GetAvailableAllowance(
      {
        symbol: symbol,
        owner: address,
        spender: spender,
      },
      {
        chain: chainId,
      },
    );

    console.log('=====GetAvailableAllowance', allowance);

    if (allowance.error) {
      message.error(allowance.errorMessage?.message || allowance.error.toString() || DEFAULT_ERROR);
      return false;
    }

    const bigA = timesDecimals(amount, decimals ?? 8);

    const allowanceBN = new BigNumber(allowance?.allowance);

    if (allowanceBN.lt(bigA)) {
      const approveAmount =
        options.walletType === WalletTypeEnum.elf ? CONTRACT_AMOUNT : bigA.multipliedBy(10).toNumber();
      await openBatchApprovalEntrance(options.walletType);
      return await approve(spender, symbol, `${approveAmount}`, chainId);
    }
    return true;
  } catch (error) {
    message.destroy();
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
    }
    captureMessage({
      type: SentryMessageType.CONTRACT,
      params: {
        name: 'checkAllowanceAndApproveGetAllowance',
        method: MethodType.CALLVIEWMETHOD,
        query: options,
        description: error,
      },
    });
    return false;
  }
};
