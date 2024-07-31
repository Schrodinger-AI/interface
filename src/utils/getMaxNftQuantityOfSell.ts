import BigNumber from 'bignumber.js';
import { ZERO } from 'constants/misc';
import { SECOND_PER_MINUTES } from 'constants/time';
import { GetListedNFTInfoList } from 'contract/market';
import { GetBalance } from 'contract/multiToken';
import { IListedNFTInfo } from 'types';
import moment from 'moment';
import { divDecimals } from './calculate';

const getMaxNftQuantityOfSell = async (chainId: Chain, symbol: string, decimals: number, address: string) => {
  try {
    if (!symbol || !address || !chainId) return false;
    const { balance } = await GetBalance({
      symbol,
      owner: address,
    });
    const nftDecimals = decimals || 0;

    if (Number(balance) === 0) {
      return false;
    }

    const res = await GetListedNFTInfoList(
      {
        symbol,
        owner: address,
      },
      {
        chain: chainId,
      },
    );

    console.log('GetListedNFTInfoList', res);

    if (res?.error || !res?.value) {
      return {
        balance: Math.floor(
          BigNumber(balance)
            .dividedBy(10 ** Number(nftDecimals))
            .toNumber(),
        ),
        listedAmount: 0,
        maxQuantity: 0,
      };
    }

    const validList = res.value.filter((item: IListedNFTInfo) => {
      const time = Number(item.duration.startTime.seconds) + Number(item.duration.durationMinutes) * SECOND_PER_MINUTES;
      const curTime = moment().unix();
      return curTime < time;
    });

    const q = validList.reduce((o: BigNumber, c: IListedNFTInfo) => {
      const { quantity } = c || {};
      return o.plus(divDecimals(quantity, nftDecimals || '0'));
    }, ZERO);

    const quantity = new BigNumber(balance ?? 0)
      .dividedBy(10 ** Number(nftDecimals))
      ?.minus(q ?? 0)
      .toNumber();

    const maxQuantity = Math.max(quantity, 0);
    return {
      balance: Math.floor(
        BigNumber(balance)
          .dividedBy(10 ** Number(nftDecimals))
          .toNumber(),
      ),
      maxQuantity: Math.floor(maxQuantity),
      listedAmount: q ?? 0,
    };
  } catch (error) {
    return {
      balance: 0,
      maxQuantity: 0,
      listedAmount: 0,
    };
  }
};

export default getMaxNftQuantityOfSell;
