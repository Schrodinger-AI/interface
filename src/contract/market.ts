import { webLoginInstance } from './webLogin';
import { formatErrorMsg } from 'utils/formatError';
import {
  ContractMethodType,
  IContractError,
  IContractOptions,
  IListedNFTInfo,
  ISendResult,
  SupportedELFChainId,
} from 'types';
import { store } from 'redux/store';
import { getTxResultRetry } from 'utils/getTxResult';
import { sleep } from '@portkey/utils';

const marketContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().info.cmsInfo;

  const addressList = {
    main: info?.marketMainAddress,
    side: info?.marketSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain: Chain = options?.chain || info!.curChain;

    console.log('=====marketContractRequest type: ', method, options?.type);
    console.log('=====marketContractRequest address: ', method, address);
    console.log('=====marketContractRequest curChain: ', method, curChain);
    console.log('=====marketContractRequest params: ', method, params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod({
        chainId: curChain,
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====marketContractRequest res: ', method, res.data);

      const result = res.data as unknown as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      return Promise.resolve(res.data);
    } else {
      const res: R = await webLoginInstance.callSendMethod({
        chainId: curChain,
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====marketContractRequest res: ', method, res);

      const result = res as IContractError;

      console.log('=====marketContractRequest result: ', method, JSON.stringify(result), result?.Error);

      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResultRetry({
        TransactionId: resTransactionId!,
        chainId: info!.curChain,
      });

      console.log('=====marketContractRequest transaction: ', method, transaction);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====marketContractRequest error: ', method, JSON.stringify(error), error);
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const GetListedNFTInfoList = async (
  params: {
    symbol: string;
    owner: string;
  },
  options?: IContractOptions,
): Promise<IContractError & { value: IListedNFTInfo[] }> => {
  try {
    const res = (await marketContractRequest('GetListedNFTInfoList', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IContractError & { value: IListedNFTInfo[] };
    return Promise.resolve(res);
  } catch (_) {
    return Promise.reject(null);
  }
};
