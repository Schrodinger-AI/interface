import { webLoginInstance } from './webLogin';
import { formatErrorMsg } from 'utils/formatError';
import { ContractMethodType, IContractError, IContractOptions, ISendResult, SupportedELFChainId } from 'types';
import { store } from 'redux/store';
import { getTxResultRetry } from 'utils/getTxResult';
import { sleep } from '@portkey/utils';
import { checkLoginOnChainStatus } from 'utils/checkLoginOnChainStatus';

const multiTokenContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().info.cmsInfo;

  const addressList = {
    main: info?.tokenMainAddress,
    side: info?.tokenSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain: Chain = options?.chain || info!.curChain;
    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod({
        chainId: curChain,
        contractAddress: address,
        methodName: method,
        args: params,
      });
      const result = res.data as unknown as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      return Promise.resolve(res.data);
    } else {
      if (!checkLoginOnChainStatus()) return Promise.reject('');
      const res: R = await webLoginInstance.callSendMethod({
        chainId: curChain,
        contractAddress: address,
        methodName: method,
        args: params,
      });

      const result = res as IContractError;

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
      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    const resError = error as IContractError;
    console.log('=====callMethod token error', resError);
    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const GetAllowance = async (
  params: IGetAllowanceParams,
  options?: IContractOptions,
): Promise<IGetAllowanceResponse & IContractError> => {
  try {
    const res = (await multiTokenContractRequest('GetAllowance', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IGetAllowanceResponse & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetAvailableAllowance = async (
  params: IGetAllowanceParams,
  options?: IContractOptions,
): Promise<IGetAllowanceResponse & IContractError> => {
  try {
    const res = (await multiTokenContractRequest('GetAvailableAllowance', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IGetAllowanceResponse & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const Approve = async (params: IApproveParams, options?: IContractOptions): Promise<IContractError> => {
  const networkType = store?.getState()?.info?.cmsInfo?.networkTypeV2;
  try {
    const res = (await multiTokenContractRequest(
      'Approve',
      { ...params, networkType },
      {
        ...options,
      },
    )) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

interface IBalanceResult {
  symbol: string;
  owner: string;
  balance: string;
}
export const GetBalance = async (
  params: IGetBalanceParams,
  options: IContractOptions = { type: ContractMethodType.VIEW },
): Promise<IBalanceResult> => (await multiTokenContractRequest('GetBalance', params, options)) as IBalanceResult;
