import { sleep } from '@portkey/utils';
import { fetchSchrodingerImagesByAdoptId, fetchWaterImageRequest } from 'api/request';
import { Adopt, AdoptMaxGen, confirmAdopt, UpdateAdoption } from 'contract/schrodinger';
import { store } from 'redux/store';
import { checkAllowanceAndApprove } from 'utils/aelfUtils';
import { timesDecimals } from 'utils/calculate';
import ProtoInstance from 'utils/initializeProto';
import { AdoptActionErrorCode } from './adopt';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { message } from 'antd';

export interface IAttribute {
  traitType: string;
  value: string;
}

export interface IAdoptNextInfo {
  symbol: string;
  tokenName: string;
  outputAmount: string | number;
  inputAmount: string | number;
  adoptId: string;
  isDirect?: boolean;
  transactionHash?: string;
}

export interface IAdoptedLogs extends IAdoptNextInfo {
  parent: string;
  parentGen: number;
  inputAmount: number;
  lossAmount: number;
  commissionAmount: number;
  imageCount: number;
  adopter: string;
  blockHeight: number;
  attributes: IAttribute[];
  gen: number;
}

export const adoptStep1Handler = async ({
  params,
  address,
  decimals,
  isDirect,
  walletType,
}: {
  address: string;
  isDirect?: boolean;
  decimals: number;
  params: {
    parent: string;
    amount: string;
    domain: string;
  };
  walletType: WalletTypeEnum;
}) => {
  const amount = params.amount;
  const { schrodingerSideAddress: contractAddress, curChain: chainId } = store.getState()?.info.cmsInfo || {};
  if (!contractAddress || !chainId) throw AdoptActionErrorCode.missingParams;
  await sleep(1000);
  const check = await checkAllowanceAndApprove({
    spender: contractAddress,
    address,
    chainId,
    symbol: params.parent,
    decimals,
    amount,
    walletType,
  });

  if (!check) throw AdoptActionErrorCode.approveFailed;

  params.amount = timesDecimals(params.amount, decimals).toFixed(0);

  const result = isDirect
    ? await AdoptMaxGen({ tick: 'SGR', amount: params.amount, domain: params.domain })
    : await Adopt(params);

  const TransactionResult = result.TransactionResult;

  const logs = await ProtoInstance.getLogEventResult<IAdoptedLogs>({
    contractAddress,
    logsName: 'Adopted',
    TransactionResult,
  });
  if (!logs) throw AdoptActionErrorCode.adoptFailed;
  return { ...logs, transactionHash: TransactionResult.TransactionId || TransactionResult.transactionId };
};

export const adoptBlindHandler = async ({ adoptId }: { adoptId: string }) => {
  const { schrodingerSideAddress: contractAddress, curChain: chainId } = store.getState()?.info.cmsInfo || {};
  if (!contractAddress || !chainId) throw AdoptActionErrorCode.missingParams;

  const result = await UpdateAdoption(adoptId);

  const TransactionResult = result.TransactionResult;

  const logs = await ProtoInstance.getLogEventResult<IAdoptedLogs>({
    contractAddress,
    logsName: 'AdoptionUpdated',
    TransactionResult,
  });
  if (!logs) throw AdoptActionErrorCode.adoptFailed;
  return { ...logs, transactionHash: TransactionResult.TransactionId || TransactionResult.transactionId };
};

export const fetchWaterImages = async (
  params: IWaterImageRequest,
  count = 0,
): Promise<IWaterImage & { error?: any }> => {
  try {
    const result = await fetchWaterImageRequest(params);
    if (!result.signature) throw 'Get not get signature';
    return result;
  } catch (error) {
    if (count > 10)
      return {
        error,
        image: '',
        signature: '',
        imageUri: '',
      };
    await sleep(500);
    count++;
    return await fetchWaterImages(params, count);
  }
};

export const fetchTraitsAndImages = async ({
  adoptId,
  adoptOnly,
  address,
  transactionHash,
  count = 0,
  faction,
}: {
  adoptId: string;
  adoptOnly: boolean;
  address: string;
  transactionHash?: string;
  count?: number;
  faction?: string;
}): Promise<IAdoptImageInfo | null> => {
  count++;
  try {
    const result = await fetchSchrodingerImagesByAdoptId({ adoptId, adoptOnly, address, transactionHash, faction });
    console.log('=====fetchTraitsAndImages result', result);
    if (result.underMaintenance) {
      message.error('Unboxing is temporarily disabled during server maintenance.');
      return null;
    }
    if (adoptOnly) {
      if (result?.adoptImageInfo?.boxImage && result?.adoptImageInfo?.attributes) {
        return result;
      } else {
        throw 'Waiting...';
      }
    }
    if (!result || (!result.imageUri && !(result.adoptImageInfo.images?.length === 2))) throw 'Waiting...';
    return result;
  } catch (error) {
    // Waiting to generate ai picture
    console.log('=====fetchTraitsAndImages error', error);
    if (adoptOnly) {
      await sleep(1000);
    } else {
      await sleep(3000);
    }

    return fetchTraitsAndImages({ adoptId, adoptOnly, address, transactionHash, count, faction });
  }
};

export const adoptStep2Handler = (params: IConfirmAdoptParams) => confirmAdopt(params);

interface IConfirmEventLogs {
  adoptId: string;
  parent: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  gen: number;
  attributes: IBaseTrait;
  issuer: string;
  owner: string;
  issueChainId: number;
  externalInfos: Record<string, string>;
  tokenName: string;
  deployer: string;
}

export const getAdoptConfirmEventLogs = async (TransactionResult: ITransactionResult): Promise<IConfirmEventLogs> => {
  const { schrodingerSideAddress: contractAddress, curChain: chainId } = store.getState()?.info.cmsInfo || {};
  if (!contractAddress || !chainId) throw AdoptActionErrorCode.missingParams;

  const logs = await ProtoInstance.getLogEventResult<IConfirmEventLogs>({
    contractAddress,
    logsName: 'Confirmed',
    TransactionResult,
  });

  if (!logs) throw AdoptActionErrorCode.parseEventLogsFailed;

  return logs;
};
