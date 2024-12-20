import { GetBalance } from 'contract/multiToken';
import useLoading from 'hooks/useLoading';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { divDecimals } from 'utils/calculate';
import { IBalanceItemProps } from '../components/BalanceItem';
import { GEN0_SYMBOL } from 'constants/common';
import { useBuyToken } from 'hooks/useBuyToken';
import { fetchPoints } from 'api/request';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { setPoints } from 'redux/reducer/userInfo';
import { dispatch } from 'redux/store';
import useGetPoints from 'redux/hooks/useGetPoints';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useModal } from '@ebay/nice-modal-react';
import SyncingOnChainLoading from 'components/SyncingOnChainLoading';
import useTelegram from 'hooks/useTelegram';

export default function useBalanceService(params?: {
  onSgrBalanceChange?: (value: string) => void;
  onElfBalanceChange?: (value: string) => void;
  onPointsChange?: (value: number) => void;
}) {
  const { onSgrBalanceChange, onElfBalanceChange, onPointsChange } = params || {};
  const [sgrBalance, setSgrBalance] = useState('0');
  const [elfBalance, setElfBalance] = useState('0');
  const { walletInfo } = useConnectWallet();
  const { isLogin } = useGetLoginStatus();
  const syncingOnChainLoading = useModal(SyncingOnChainLoading);
  const { showLoading, closeLoading } = useLoading();
  const { checkBalanceAndJump } = useBuyToken();
  const { points } = useGetPoints();
  const { isInTG } = useTelegram();

  const balanceData: Array<IBalanceItemProps> = useMemo(() => {
    return [
      {
        symbol: 'SGR',
        amount: divDecimals(sgrBalance, 8).toString(),
        onBuy: () => {
          if (!isLogin && isInTG) {
            syncingOnChainLoading.show({
              checkLogin: true,
            });
            return;
          }
          checkBalanceAndJump({
            type: 'buySGR',
            theme: 'dark',
          });
        },
      },
      {
        symbol: 'FISH',
        amount: points,
        onBuy: () => {
          if (!isLogin && isInTG) {
            syncingOnChainLoading.show({
              checkLogin: true,
            });
            return;
          }
          checkBalanceAndJump({
            type: 'buyFISH',
            theme: 'dark',
          });
        },
      },
      {
        symbol: 'ELF',
        amount: divDecimals(elfBalance, 8).toString(),
        onBuy: () => {
          if (!isLogin && isInTG) {
            syncingOnChainLoading.show({
              checkLogin: true,
            });
            return;
          }
          checkBalanceAndJump({
            type: 'buyELF',
            theme: 'dark',
          });
        },
      },
    ];
  }, [checkBalanceAndJump, elfBalance, isInTG, isLogin, points, sgrBalance, syncingOnChainLoading]);

  const getBalance = useCallback(async () => {
    if (!walletInfo?.address) return;
    try {
      showLoading();
      const [sgrBalanceRes, elfBalanceRes, pointsRes] = await Promise.all([
        GetBalance({
          symbol: GEN0_SYMBOL,
          owner: walletInfo.address,
        }),
        GetBalance({
          symbol: 'ELF',
          owner: walletInfo.address,
        }),
        fetchPoints({ address: walletInfo.address }),
      ]);
      setSgrBalance(sgrBalanceRes?.balance || '0');
      onSgrBalanceChange && onSgrBalanceChange(sgrBalanceRes?.balance || '0');
      onElfBalanceChange && onElfBalanceChange(elfBalanceRes?.balance || '0');
      onPointsChange && onPointsChange(pointsRes?.fishScore || 0);
      setElfBalance(elfBalanceRes?.balance || '0');
      dispatch(setPoints(pointsRes?.fishScore || 0));
      return {
        sgrBalance: sgrBalanceRes?.balance || '0',
        elfBalance: elfBalanceRes?.balance || '0',
        fishScore: pointsRes?.fishScore || '0',
      };
    } catch (error) {
      console.error('getBalance error', error);
      return {
        sgrBalance: '0',
        elfBalance: '0',
        fishScore: '0',
      };
    } finally {
      closeLoading();
    }
  }, [closeLoading, onElfBalanceChange, onSgrBalanceChange, onPointsChange, showLoading, walletInfo?.address]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const fullAddress = useMemo(() => {
    return walletInfo?.address ? addPrefixSuffix(walletInfo.address) : '';
  }, [walletInfo?.address]);

  const formatAddress = useMemo(() => {
    if (!walletInfo?.address) return '';
    return getOmittedStr(fullAddress, OmittedType.ADDRESS);
  }, [fullAddress, walletInfo?.address]);

  const updatePoints = (fishScore: number) => {
    dispatch(setPoints(fishScore));
  };

  return {
    sgrBalance,
    elfBalance,
    refresh: getBalance,
    address: walletInfo?.address,
    formatAddress,
    fullAddress,
    balanceData,
    fish: points,
    updatePoints,
  };
}
