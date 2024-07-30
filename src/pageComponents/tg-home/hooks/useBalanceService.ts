import { GetBalance } from 'contract/multiToken';
import useLoading from 'hooks/useLoading';
import { useWalletService } from 'hooks/useWallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { divDecimals } from 'utils/calculate';
import { IBalanceItemProps } from '../components/BalanceItem';
import { GEN0_SYMBOL } from 'constants/common';
import { useJumpToPage } from 'hooks/useJumpToPage';
import { BUY_ELF_URL, BUY_SGR_URL } from 'constants/router';

export default function useBalanceService({ onSgrBalanceChange }: { onSgrBalanceChange?: (value: string) => void }) {
  const [sgrBalance, setSgrBalance] = useState('0');
  const [elfBalance, setElfBalance] = useState('0');
  const { wallet } = useWalletService();
  const { showLoading, closeLoading } = useLoading();
  const { jumpToPage } = useJumpToPage();

  const balanceData: Array<IBalanceItemProps> = useMemo(() => {
    return [
      {
        symbol: 'SGR',
        amount: divDecimals(sgrBalance, 8).toString(),
        onBuy: () => {
          jumpToPage({ link: BUY_SGR_URL, linkType: 'link' });
        },
      },
      {
        symbol: 'ELF',
        amount: divDecimals(elfBalance, 8).toString(),
        onBuy: () => {
          jumpToPage({ link: BUY_ELF_URL, linkType: 'link' });
        },
      },
    ];
  }, [elfBalance, jumpToPage, sgrBalance]);

  const getBalance = useCallback(async () => {
    if (!wallet.address) return;
    try {
      showLoading();
      const [sgrBalanceRes, elfBalanceRes] = await Promise.all([
        GetBalance({
          symbol: GEN0_SYMBOL,
          owner: wallet.address,
        }),
        GetBalance({
          symbol: 'ELF',
          owner: wallet.address,
        }),
      ]);
      setSgrBalance(sgrBalanceRes?.balance || '0');
      onSgrBalanceChange && onSgrBalanceChange(sgrBalanceRes?.balance || '0');
      setElfBalance(elfBalanceRes?.balance || '0');
      return {
        sgrBalance: sgrBalanceRes?.balance || '0',
        elfBalance: sgrBalanceRes?.balance || '0',
      };
    } catch (error) {
      console.error('getBalance error', error);
      return {
        sgrBalance: '0',
        elfBalance: '0',
      };
    } finally {
      closeLoading();
    }
  }, [closeLoading, onSgrBalanceChange, showLoading, wallet.address]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const fullAddress = useMemo(() => {
    return addPrefixSuffix(wallet.address);
  }, [wallet.address]);

  const formatAddress = useMemo(() => {
    if (!wallet.address) return '';
    return getOmittedStr(fullAddress, OmittedType.ADDRESS);
  }, [fullAddress, wallet.address]);

  return {
    sgrBalance,
    elfBalance,
    refresh: getBalance,
    address: wallet.address,
    formatAddress,
    fullAddress,
    balanceData,
  };
}
