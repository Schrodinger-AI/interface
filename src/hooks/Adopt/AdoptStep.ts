import { sleep } from '@portkey/utils';
import { fetchSchrodingerImagesByAdoptId } from 'api/request';
import { Adopt, confirmAdopt } from 'contract/schrodinger';
import { store } from 'redux/store';
import { checkAllowanceAndApprove } from 'utils/aelfUtils';
import { timesDecimals } from 'utils/calculate';
import ProtoInstance from 'utils/initializeProto';
import { AdoptActionErrorCode } from './adopt';

export interface IAttribute {
  traitType: string;
  value: string;
}

export interface IAdopted {
  adoptId: string;
  parent: string;
  parentGen: number;
  inputAmount: number;
  lossAmount: number;
  commissionAmount: number;
  outputAmount: number;
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
}: {
  address: string;
  decimals: number;
  params: {
    parent: string;
    amount: string;
    domain: string;
  };
}) => {
  const amount = params.amount;
  const { schrodingerSideAddress: contractAddress, curChain: chainId } = store.getState().info.cmsInfo || {};
  if (!contractAddress || !chainId) throw AdoptActionErrorCode.missingParams;
  await sleep(1000);
  const check = await checkAllowanceAndApprove({
    spender: contractAddress,
    address,
    chainId,
    symbol: params.parent,
    decimals,
    amount,
  });

  if (!check) throw AdoptActionErrorCode.approveFailed;

  params.amount = timesDecimals(params.amount, decimals).toFixed(0);

  const result = await Adopt(params);

  const TransactionResult = result.TransactionResult;

  const logs = await ProtoInstance.getLogEventResult<IAdopted>({
    contractAddress,
    logsName: 'Adopted',
    TransactionResult,
  });
  if (!logs) throw AdoptActionErrorCode.adoptFailed;
  const { adoptId } = logs;
  return adoptId;
};

export const fetchTraitsAndImages = async (adoptId: string, count = 0): Promise<ISchrodingerImages> => {
  if (!count) await sleep(10000); // Waiting to generate ai picture
  count++;
  try {
    const result = await fetchSchrodingerImagesByAdoptId({ adoptId });
    if (!result || !result.items?.length) throw 'Waiting';
    return result;
  } catch (error) {
    await sleep(3000);
    return fetchTraitsAndImages(adoptId, count);
  }
};

export const adoptStep2Handler = (params: IConfirmAdoptParams) => confirmAdopt(params);
