import { webLoginInstance } from './webLogin';
import { sleep } from 'utils';
import { formatErrorMsg } from 'utils/formattError';
import { ContractMethodType, IContractError, IContractOptions, ISendResult, SupportedELFChainId } from 'types';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'redux/store';

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
      const res: R = await webLoginInstance.callViewMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });
      const result = res as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      return Promise.resolve(res);
    } else {
      const res: R = await webLoginInstance.callSendMethod(curChain, {
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
      const transaction = await getTxResult(resTransactionId!, info!.curChain);
      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    const resError = error as IContractError;
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

export const Approve = async (params: IApproveParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await multiTokenContractRequest('Approve', params, {
      ...options,
    })) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
