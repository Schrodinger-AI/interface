import { AdoptWithVoucher, ConfirmVoucher } from 'contract/schrodinger';
import ProtoInstance from 'utils/initializeProto';
import { useCmsInfo } from 'redux/hooks';
import { IVoucherInfo } from 'types';
import { useCallback, useMemo } from 'react';
import { voucherAdoption } from 'api/request';
import { sleep } from '@portkey/utils';
import { fetchTraitsAndImages } from './Adopt/AdoptStep';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useModal } from '@ebay/nice-modal-react';
import TGAdoptLoading from 'components/TGAdoptLoading';

export interface IAdoptWithVoucherLogs {
  voucher_info: IVoucherInfo;
}

export default function useAdoptWithVoucher() {
  const cmsInfo = useCmsInfo();
  const { walletInfo } = useConnectWallet();
  const tgAdoptLoading = useModal(TGAdoptLoading);

  const contractAddress = useMemo(() => cmsInfo?.schrodingerSideAddress, [cmsInfo?.schrodingerSideAddress]);

  const showErrorResultModal = async () => {
    console.log('=====show error');
  };

  const adopt = useCallback(
    async ({ tick }: { tick: string }) => {
      if (!contractAddress) return false;
      try {
        const result = await AdoptWithVoucher({
          tick,
        });
        const TransactionResult = result.TransactionResult;
        const logs = await ProtoInstance.getLogEventResult<IAdoptWithVoucherLogs>({
          contractAddress,
          logsName: 'AdoptedWithVoucher',
          TransactionResult,
        });
        if (!logs) return;
        return {
          ...logs.voucher_info,
          transactionHash: TransactionResult.TransactionId || TransactionResult.transactionId,
        };
      } catch (error) {
        console.log('error');
        return false;
      }
    },
    [contractAddress],
  );

  const getVoucherAdoptionResult = useCallback(async (params: IVoucherInfo) => {
    try {
      const { voucher_id } = params;
      const res = await voucherAdoption({ voucherId: voucher_id });
      if (res.voucher_id) {
        return res;
      }
      await sleep(1000);
      getVoucherAdoptionResult(params);
    } catch (error) {
      return false;
    }
  }, []);

  const getBlind = useCallback(
    async ({ voucherId, signature }: { voucherId: string; signature: string }) => {
      const result = await ConfirmVoucher({
        voucherId,
        signature,
      });

      if (!contractAddress) return;
      const TransactionResult = result.TransactionResult;

      const logs = await ProtoInstance.getLogEventResult<IAdoptWithVoucherLogs>({
        contractAddress,
        logsName: 'VoucherConfirmed',
        TransactionResult,
      });
      if (!logs) return;
      return {
        ...logs.voucher_info,
        transactionHash: TransactionResult.TransactionId || TransactionResult.transactionId,
      };
    },
    [contractAddress],
  );

  const showResultModal = () => {
    // TODO
    console.log('=====showResultModal');
  };

  const adoptWithVoucher = useCallback(
    async ({ tick }: { tick: string }) => {
      tgAdoptLoading.show();
      const voucherInfo = await adopt({ tick });
      if (voucherInfo && voucherInfo.voucher_id) {
        const result = await getVoucherAdoptionResult(voucherInfo);
        if (result && result.isRare) {
          // rare
          const res = await getBlind({
            voucherId: voucherInfo.voucher_id,
            signature: result.signature,
          });
          if (res && res.adopt_id && walletInfo?.address) {
            const blindInfo = fetchTraitsAndImages({
              adoptId: res.adopt_id,
              transactionHash: res.transactionHash,
              adoptOnly: true,
              address: walletInfo.address,
            });
            showResultModal();
            return;
          }
          showErrorResultModal();
        } else {
          // Remind the user that they did not obtain a rare cat
        }
      } else {
        showErrorResultModal();
      }
    },
    [adopt, getBlind, getVoucherAdoptionResult, tgAdoptLoading, walletInfo?.address],
  );

  return { adoptWithVoucher };
}
