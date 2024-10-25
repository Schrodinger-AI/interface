import { webLoginInstance } from './webLogin';
import { formatErrorMsg } from 'utils/formatError';
import { ContractMethodType, IContractError, IContractOptions, ISendResult, SupportedELFChainId } from 'types';
import { store } from 'redux/store';
import { getTxResultRetry } from 'utils/getTxResult';
import { sleep } from '@portkey/utils';

const schrodingerContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().info.cmsInfo;

  const addressList = {
    main: info?.schrodingerMainAddress,
    side: info?.schrodingerSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain: Chain = options?.chain || info!.curChain;

    console.log('=====schrodingerContractRequest type: ', method, options?.type);
    console.log('=====schrodingerContractRequest address: ', method, address);
    console.log('=====schrodingerContractRequest curChain: ', method, curChain);
    console.log('=====schrodingerContractRequest params: ', method, params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod({
        chainId: curChain,
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====schrodingerContractRequest res: ', method, res.data);

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

      console.log('=====schrodingerContractRequest res: ', method, res);

      const result = res as IContractError;

      console.log('=====schrodingerContractRequest result: ', method, JSON.stringify(result), result?.Error);

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

      console.log('=====schrodingerContractRequest transaction: ', method, transaction);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====schrodingerContractRequest error: ', method, JSON.stringify(error), error);
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const Join = async (
  params: {
    domain: string;
  },
  options?: IContractOptions,
): Promise<IContractError> => {
  try {
    const res = (await schrodingerContractRequest('Join', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetJoinRecord = async (address: string, options?: IContractOptions): Promise<boolean> => {
  try {
    const res: any = await schrodingerContractRequest('GetJoinRecord', address, {
      ...options,
      type: ContractMethodType.VIEW,
    });
    const isJoin = res?.value;
    return Promise.resolve(Boolean(isJoin));
  } catch (error) {
    return Promise.reject(error);
  }
};

export const Adopt = async (
  params: {
    parent: string;
    amount: string;
    domain: string;
  },
  options?: IContractOptions,
): Promise<ISendResult> => await schrodingerContractRequest('Adopt', params, options);

export const AdoptMaxGen = async (
  params: {
    tick: string;
    amount: string;
    domain: string;
  },
  options?: IContractOptions,
): Promise<ISendResult> => await schrodingerContractRequest('AdoptMaxGen', params, options);

export const UpdateAdoption = async (adoptId: string, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('UpdateAdoption', adoptId, options);

export const confirmAdopt = async (params: IConfirmAdoptParams, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('Confirm', params, options);

export const rerollSGR = async (params: IRerollSGRParams, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('Reroll', params, options);

export const AcceptReferral = async (params: { referrer: string }, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('AcceptReferral', params, options);

export const RerollAdoption = async (adoptId: string, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('RerollAdoption', adoptId, options);

export const Spin = async (params: ISpin, options?: IContractOptions): Promise<ISendResult> =>
  await schrodingerContractRequest('Spin', params, options);

export const AdoptWithVoucher = async (
  params: {
    tick: string;
  },
  options?: IContractOptions,
): Promise<ISendResult> => await schrodingerContractRequest('AdoptWithVoucher', params, options);

export const ConfirmVoucher = async (
  params: {
    voucherId: string;
    signature: string;
  },
  options?: IContractOptions,
): Promise<ISendResult> => await schrodingerContractRequest('ConfirmVoucher', params, options);

export const GetAdoptionVoucherAmount = async (
  params: {
    tick: string;
    account: string;
  },
  options?: IContractOptions,
): Promise<{ value: string }> => {
  try {
    const res: any = await schrodingerContractRequest('GetAdoptionVoucherAmount', params, {
      ...options,
      type: ContractMethodType.VIEW,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
