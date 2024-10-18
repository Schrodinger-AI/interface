import { useModal } from '@ebay/nice-modal-react';
import { message } from 'antd';
import JoinModal from 'components/JoinModal';
import { GetJoinRecord, Join } from 'contract/schrodinger';
import { useCallback } from 'react';
import { IContractError } from 'types';
import { getDomain } from 'utils';
import { TransactionFeeNotEnough } from 'utils/formatError';
import useAutoJoin from './useAutoJoin';
import { store } from 'redux/store';
import { setIsJoin } from 'redux/reducer/info';
import { TelegramPlatform } from '@portkey/did-ui-react';
import { useShowSpecialCatActivity } from './useShowSpecialCatActivity';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import useUserIsInChannel from './useUserIsInChannel';

export const useCheckJoined = () => {
  const JoinModalInit = useModal(JoinModal);
  const { walletInfo } = useConnectWallet();
  const [notAutoJoin] = useAutoJoin();
  const { showSpecialCatActivity } = useShowSpecialCatActivity();
  const { getUserChannelStatus } = useUserIsInChannel();

  const toJoin = async () => {
    return new Promise((resolve) => {
      const referrerAddress = TelegramPlatform.getInitData()?.start_param;

      if (referrerAddress) return;

      JoinModalInit.show({
        buttonInfo: {
          openLoading: true,
          onConfirm: async () => {
            const domain = getDomain();
            try {
              const res = await Join({
                domain,
              });
              store.dispatch(setIsJoin(true));
              resolve(true);
              console.log(res, 'res==checkJoined');
            } catch (error) {
              resolve(false);
              const errorMessage = (error as IContractError).errorMessage?.message;
              if (errorMessage?.includes('Pre-Error: Transaction fee not enough')) {
                message.error(TransactionFeeNotEnough);
                return;
              }
              message.error(errorMessage);
              console.log(error, 'error===checkJoined');
            } finally {
              JoinModalInit.hide();
              showSpecialCatActivity();
            }
          },
        },
        onCancel: () => {
          resolve(false);
          JoinModalInit.hide();
          showSpecialCatActivity();
        },
      });
    });
  };

  const getJoinStatus = useCallback(
    async (address?: string) => {
      try {
        const isJoin = await GetJoinRecord(address || walletInfo?.address || '');
        store.dispatch(setIsJoin(isJoin));
        return isJoin;
      } catch (error) {
        console.log('getJoinStats-error', error);
        store.dispatch(setIsJoin(false));
        return false;
      }
    },
    [walletInfo?.address],
  );

  const checkJoined = useCallback(
    async function (address: string) {
      if (!address) return;
      const isJoin = await getJoinStatus(address);
      if (isJoin || notAutoJoin) {
        showSpecialCatActivity();
        return isJoin;
      }
      return await toJoin();
    },
    [getJoinStatus, notAutoJoin, showSpecialCatActivity, toJoin],
  );

  return { checkJoined, toJoin, getJoinStatus };
};
