import { useModal } from '@ebay/nice-modal-react';
import AdoptActionModal from 'components/AdoptActionModal';
import { useCallback } from 'react';
import { useGetAllBalance } from './useGetAllBalance';
import { TSGRToken } from 'types/tokens';
import { useGetTokenPrice, useTokenPrice } from './useAssets';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { ZERO } from 'constants/misc';

export const useResetHandler = () => {
  const resetModal = useModal(AdoptActionModal);
  const getAllBalance = useGetAllBalance();
  const { tokenPrice: elfTokenPrice } = useTokenPrice();
  const getTokenPrice = useGetTokenPrice();

  return useCallback(
    async (parentItemInfo: TSGRToken, account: string) => {
      let parentPrice: string | undefined = undefined;
      try {
        parentPrice = await getTokenPrice(parentItemInfo.symbol);
      } catch (error) {
        console.log('getTokenPrice', error);
      }

      try {
        const [symbolBalance, elfBalance] = await getAllBalance([parentItemInfo, AELF_TOKEN_INFO], account);

        resetModal.show({
          isReset: true,
          modalTitle: 'Reroll',
          info: {
            logo: parentItemInfo.inscriptionImage,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: parentItemInfo.symbol,
          },
          inputProps: {
            max: symbolBalance,
            decimals: parentItemInfo.decimals,
          },
          balanceList: [
            {
              amount: symbolBalance,
              suffix: parentItemInfo.symbol,
              usd: `${symbolBalance && parentPrice ? ZERO.plus(symbolBalance).times(parentPrice).toFixed(2) : '--'}`,
            },
            {
              amount: elfBalance,
              suffix: AELF_TOKEN_INFO.symbol,
              usd: `${elfBalance && elfTokenPrice ? ZERO.plus(elfBalance).times(elfTokenPrice).toFixed(2) : '--'}`,
            },
          ],
          onConfirm: (amount: string) => {
            console.log('amount', amount);
          },
        });
      } catch (error) {
        //
      }
    },
    [elfTokenPrice, getAllBalance, getTokenPrice, resetModal],
  );
};
