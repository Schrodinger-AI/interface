import { WebLoginState, useLoginState } from 'aelf-web-login';
import { useWalletService, useWalletSyncCompleted } from 'hooks/useWallet';
import useLoading from 'hooks/useLoading';
import { useCallback, useState } from 'react';
import { useRequest } from 'ahooks';
import { TriggerType } from '../CounDownPage';
import { GetJoinRecord, Join } from 'contract/schrodinger';
import { message } from 'antd';
import { addPrefixSuffix, getOmittedStr } from 'utils';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';

export interface IProps {
  trigger: TriggerType;
}

export default function useCheckJoinStatus({ trigger }: IProps) {
  const { cmsInfo } = useGetStoreInfo();
  const { getAccountInfoSync } = useWalletSyncCompleted(cmsInfo?.curChain);

  const { showLoading, closeLoading, visible } = useLoading();

  const { wallet } = useWalletService();

  const [isJoin, setIsJoin] = useState(false);

  const checkSync = useCallback(async () => {
    const targetAddress = await getAccountInfoSync();
    return targetAddress;
  }, [getAccountInfoSync]);

  const {
    runAsync: pollingRequestSync,
    cancel,
    data,
  } = useRequest(checkSync, {
    pollingInterval: 1000,
    manual: true,
    onSuccess: (data) => {
      if (!data) {
        if (visible) return;
        showLoading({
          content: 'Synchronising data on the blockchain...',
          showClose: true,
          onClose: () => {
            cancel();
          },
        });
        return;
      }
      cancel();
      closeLoading();
      handleJoin();
    },
  });

  useLoginState(async (state: WebLoginState) => {
    if (state === WebLoginState.logined) {
      try {
        const isJoin = await GetJoinRecord(addPrefixSuffix(wallet.address, cmsInfo?.curChain));
        if (isJoin) {
          setIsJoin(isJoin.value);
          return;
        }
        setIsJoin(false);
      } catch (err) {
        console.error(err);
        return;
      }

      if (isJoin) return;
      if (trigger === 'join') {
        await pollingRequestSync();
      }
    }
    if (state === WebLoginState.logouting) {
      setIsJoin(false);
    }
  });

  const handleJoin = useCallback(async () => {
    showLoading();
    try {
      if (wallet.address) {
        const res = await Join({
          domain: document.location.host,
        });
        if (res) {
          setIsJoin(true);
          closeLoading();
        }
      }
    } catch (err) {
      message.error('Failed to be enrolled. Please try again.');
      closeLoading();
      return;
    }
  }, [wallet.address]);

  return {
    isJoin,
    pollingRequestSync,
  };
}
