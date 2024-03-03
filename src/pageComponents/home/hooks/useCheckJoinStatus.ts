import { WebLoginEvents, WebLoginState, useWebLogin, useWebLoginEvent } from 'aelf-web-login';
import { useWalletSyncCompleted } from 'hooks/useWallet';
import { useWalletInit } from 'hooks/useWallet';
import { cmsInfo } from '../../../../mock';
import useLoading from 'hooks/useLoading';
import { useCallback, useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { TriggerType } from '../CounDownPage';

export interface IProps {
  trigger: TriggerType;
}

export default function useCheckJoinStatus({ trigger }: IProps) {
  const { pollingRequestSync } = useWalletSyncCompleted(cmsInfo.curChain);
  const { loginState, wallet } = useWebLogin();

  const [isJoin, setIsJoin] = useState(false);

  useWebLoginEvent(WebLoginEvents.LOGINED, async () => {
    //checkJoin

    if (isJoin) return;

    if (trigger === 'join') {
      //wait sync
      const address = await pollingRequestSync();
      if (address) {
        //send contract
      }
    }
  });

  return {
    isJoin,
  };
}
