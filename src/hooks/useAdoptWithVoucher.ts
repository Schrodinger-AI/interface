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
import AdoptResultModal from 'pageComponents/tg-bags/components/AdoptResultModal';
import { ITrait } from 'types/tokens';

export interface IAdoptWithVoucherLogs {
  voucherInfo: IVoucherInfo;
}

export default function useAdoptWithVoucher() {
  const cmsInfo = useCmsInfo();
  const { walletInfo } = useConnectWallet();
  const tgAdoptLoading = useModal(TGAdoptLoading);
  const adoptResultModal = useModal(AdoptResultModal);

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
        console.log('logs', logs);
        if (!logs) return;
        return {
          ...logs.voucherInfo,
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
      const { voucherId } = params;
      const res = await voucherAdoption({ voucherId });
      if (res.voucherId) {
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
        ...logs.voucherInfo,
        transactionHash: TransactionResult.TransactionId || TransactionResult.transactionId,
      };
    },
    [contractAddress],
  );

  const showResultModal = (traitData: IAdoptImageInfo, isRare: boolean, traits: ITrait[]) => {
    // TODO
    adoptResultModal.show({
      traitData,
      isRare,
      traits,
    });
  };

  const adoptWithVoucher = useCallback(
    async ({ tick }: { tick: string }) => {
      tgAdoptLoading.show();
      const voucherInfo = await adopt({ tick });
      console.log('voucherInfo', voucherInfo);
      if (voucherInfo && voucherInfo.voucherId) {
        const result = await getVoucherAdoptionResult(voucherInfo);
        console.log('result', result);
        if (result && result.isRare) {
          // rare
          const res = await getBlind({
            voucherId: voucherInfo.voucherId,
            signature: result.signature,
          });
          console.log('res', res);
          tgAdoptLoading.hide();
          if (res && res.adoptId && walletInfo?.address) {
            const blindInfo = await fetchTraitsAndImages({
              adoptId: res.adoptId,
              transactionHash: res.transactionHash,
              adoptOnly: true,
              address: walletInfo.address,
            });
            console.log('blindInfo', blindInfo);
            showResultModal(blindInfo, result.isRare, voucherInfo.attributes.data);
            return;
          }
          showErrorResultModal();
        } else {
          // Remind the user that they did not obtain a rare cat
          adoptResultModal.show({
            traits: voucherInfo.attributes.data,
          });
        }
      } else {
        showErrorResultModal();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [adopt, getBlind, getVoucherAdoptionResult, tgAdoptLoading, walletInfo?.address],
  );

  return { adoptWithVoucher };
}
