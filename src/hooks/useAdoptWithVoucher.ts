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
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { formatTraits } from 'utils/formatTraits';
import { addPrefixSuffix } from 'utils/addressFormatting';

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
      return await getVoucherAdoptionResult(params);
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

  const showResultModal = (
    traitData: IAdoptImageInfo,
    isRare: boolean,
    voucherInfo: IVoucherInfo,
    catsRankProbability?: TRankInfoAddLevelInfo[] | false,
  ) => {
    // TODO
    adoptResultModal.show({
      traitData,
      isRare,
      voucherInfo,
      catsRankProbability,
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
        if (result && result?.voucherId) {
          if (result.isRare) {
            // rare
            const res = await getBlind({
              voucherId: voucherInfo.voucherId,
              signature: result.signature,
            });
            console.log('res', res);
            if (res && res.adoptId && walletInfo?.address) {
              const traits = formatTraits(voucherInfo.attributes.data);
              let catsRankProbability: TRankInfoAddLevelInfo[] | false = [];
              if (traits) {
                catsRankProbability = await getCatsRankProbability({
                  catsTraits: [traits],
                  address: addPrefixSuffix(walletInfo.address),
                });
                console.log('catsRankProbability', catsRankProbability);
              }
              const blindInfo = await fetchTraitsAndImages({
                adoptId: res.adoptId,
                transactionHash: res.transactionHash,
                adoptOnly: true,
                address: walletInfo.address,
              });
              console.log('blindInfo', blindInfo);
              tgAdoptLoading.hide();
              showResultModal(blindInfo, result.isRare, res, catsRankProbability);
              return;
            }
            tgAdoptLoading.hide();
            showErrorResultModal();
          } else {
            // Remind the user that they did not obtain a rare cat
            tgAdoptLoading.hide();
            adoptResultModal.show({
              voucherInfo,
            });
          }
        }
      } else {
        tgAdoptLoading.hide();
        showErrorResultModal();
      }
      console.log('adoptWithVoucher end');
      return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [adopt, getBlind, getVoucherAdoptionResult, tgAdoptLoading, walletInfo?.address],
  );

  return { adoptWithVoucher };
}
