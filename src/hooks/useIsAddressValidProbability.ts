'use client';
import { useEffect } from 'react';
import { useWalletService } from './useWallet';
import { getIsAddressValidProbability } from 'api/request';
import { dispatch } from 'redux/store';
import { setIsAddressValidProbability } from 'redux/reducer/info';
import { addPrefixSuffix } from 'utils/addressFormatting';

export function useIsAddressValidProbability() {
  const { wallet } = useWalletService();

  const getValid = async (address: string) => {
    try {
      const res = await getIsAddressValidProbability({
        address: addPrefixSuffix(address),
      });
      dispatch(setIsAddressValidProbability(res.isAddressValid));
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    if (wallet.address) {
      getValid(wallet.address);
    } else {
      dispatch(setIsAddressValidProbability(false));
    }
  }, [wallet.address]);
}
