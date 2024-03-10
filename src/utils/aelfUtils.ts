import { getRpcUrls } from 'constants/url';
import { sleep } from 'utils';
import AElf from 'aelf-sdk';
import { Approve, GetAllowance } from 'contract/multiToken';
import { message } from 'antd';
import { DEFAULT_ERROR } from './formattError';
import { timesDecimals } from './calculate';
import BigNumber from 'bignumber.js';
import { IContractError } from 'types';
import { CONTRACT_AMOUNT } from 'constants/common';

const httpProviders: any = {};
export function getAElf(rpcUrl?: string) {
  const rpc = rpcUrl || '';
  if (!httpProviders[rpc]) {
    httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  }
  return httpProviders[rpc];
}

export async function getTxResult(
  TransactionId: string,
  chainId: Chain,
  reGetCount = 0,
  retryCountWhenNotExist = 0,
): Promise<any> {
  const rpcUrl = getRpcUrls()[chainId];
  const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
  if (txResult.error && txResult.errorMessage) {
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }

  if (!txResult) {
    throw Error('Failed to retrieve transaction result.');
  }

  if (txResult.Status.toLowerCase() === 'notexisted') {
    if (retryCountWhenNotExist > 5) {
      throw Error({ ...txResult.Error, TransactionId } || 'Transaction error');
    }
    await sleep(1000);
    retryCountWhenNotExist++;
    return getTxResult(TransactionId, chainId, reGetCount, retryCountWhenNotExist);
  }

  if (txResult.Status.toLowerCase() === 'pending') {
    // || txResult.Status.toLowerCase() === 'notexisted'
    if (reGetCount > 10) {
      throw Error(`Timeout. Transaction ID:${TransactionId}`);
    }
    await sleep(1000);
    reGetCount++;
    return getTxResult(TransactionId, chainId, reGetCount, retryCountWhenNotExist);
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return { TransactionId, txResult };
  }

  throw Error({ ...txResult.Error, TransactionId } || 'Transaction error');
}

const isNightElf = () => {
  const walletInfo = localStorage.getItem('wallet-info');
  const walletInfoObj = walletInfo ? JSON.parse(walletInfo) : {};
  let isNightElfStatus = true;
  if (walletInfoObj?.discoverInfo || walletInfoObj?.portkeyInfo) {
    isNightElfStatus = false;
  }

  return isNightElfStatus;
};

export const approve = async (spender: string, symbol: string, amount: string, chainId?: Chain) => {
  try {
    const approveResult = await Approve(
      {
        spender: spender,
        symbol,
        amount: Number(amount),
      },
      {
        chain: chainId,
      },
    );

    if (approveResult.error) {
      message.error(approveResult?.errorMessage?.message || DEFAULT_ERROR);
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
}) => {
  const { chainId, symbol = 'ELF', address, spender, amount, decimals = 8 } = options;
  try {
    const allowance = await GetAllowance(
      {
        symbol: symbol,
        owner: address,
        spender: spender,
      },
      {
        chain: chainId,
      },
    );

    if (allowance.error) {
      message.error(allowance.errorMessage?.message || allowance.error.toString() || DEFAULT_ERROR);
      return false;
    }

    const bigA = timesDecimals(amount, decimals ?? 8);

    const allowanceBN = new BigNumber(allowance?.allowance);

    if (allowanceBN.lt(bigA)) {
      const approveAmount = isNightElf() ? CONTRACT_AMOUNT : bigA.toNumber();
      return await approve(spender, symbol, `${approveAmount}`, chainId);
    }
    return true;
  } catch (error) {
    message.destroy();
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
    }
    return false;
  }
};
