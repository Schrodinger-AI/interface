import { ChainId } from '@portkey/types';
import { sleep } from '@portkey/utils';
import { fetchSchrodingerImagesByAdoptId } from 'api/request';
import { Adopt, confirmAdopt } from 'contract/schrodinger';
import { store } from 'redux/store';
import { checkAllowanceAndApprove } from 'utils/aelfUtils';
import { timesDecimals } from 'utils/calculate';
import ProtoInstance from 'utils/initializeProto';

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
  try {
    const amount = params.amount;
    const { schrodingerSideAddress: contractAddress, curChain: chainId } = store.getState().info.cmsInfo || {};
    if (!contractAddress || !chainId) throw 'Missing contractAddress or chainId';
    const check = await checkAllowanceAndApprove({
      spender: contractAddress,
      address,
      chainId,
      symbol: params.parent,
      decimals,
      amount,
    });

    if (!check) throw 'Approve failed';

    params.amount = timesDecimals(params.amount, decimals).toFixed(0);

    const result = await Adopt(params);
    //   const result
    const logs = await ProtoInstance.getLogEventResult<IAdopted>({
      contractAddress,
      logsName: 'Adopted',
      TransactionResult: result.TransactionResult,
    });
    if (!logs) throw 'Can not get adopt result!';
    const { adoptId } = logs;
    return adoptId;
  } catch (error) {
    console.error(error);
    throw 'Adopt error,  please Try again';
  }
};

export const fetchTraitsAndImages = async (adoptId: string, count = 0): Promise<ISchrodingerImages> => {
  if (!count) await sleep(10000); // Waiting to generate ai picture
  count++;
  try {
    const result = await fetchSchrodingerImagesByAdoptId({ adoptId });
    if (!result || !result.items?.length) throw 'Waiting';
    return result;
  } catch (error) {
    await sleep(5000);
    return fetchTraitsAndImages(adoptId, count);
  }
};

export const adoptStep2Handler = async (params: IConfirmAdoptParams) => {
  const result = await confirmAdopt(params);
  console.log(result, 'result===');
};
