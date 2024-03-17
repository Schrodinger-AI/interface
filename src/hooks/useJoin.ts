import { useModal } from '@ebay/nice-modal-react';
import JoinModal from 'components/JoinModal';
import { GetJoinRecord, Join } from 'contract/schrodinger';
import { useCallback } from 'react';
import { getDomain } from 'utils';

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
