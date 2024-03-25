import { useModal } from '@ebay/nice-modal-react';
import { message } from 'antd';
import JoinModal from 'components/JoinModal';
import { GetJoinRecord, Join } from 'contract/schrodinger';
import { useCallback } from 'react';
import { IContractError } from 'types';
import { getDomain } from 'utils';
import { TransactionFeeNotEnough } from 'utils/formattError';

export const useCheckJoined = () => {
  const JoinModalInit = useModal(JoinModal);

  const checkJoined = useCallback(async () => {
    return new Promise((resolve) => {
      JoinModalInit.show({
        buttonInfo: {
          openLoading: true,
          onConfirm: async () => {
            const domain = getDomain();
            try {
              const res = await Join({
                domain,
              });
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
            }
          },
        },
        onCancel: () => {
          resolve(false);
          JoinModalInit.hide();
        },
      });
    });
  }, [JoinModalInit]);

  return useCallback(
    async (address: string) => {
      if (!address) return;
      const isJoin = await GetJoinRecord(address);
      if (isJoin) return;
      return await checkJoined();
    },
    [checkJoined],
  );
};
