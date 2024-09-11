import { useModal } from '@ebay/nice-modal-react';
import PromptModal from 'components/PromptModal';
import { useCallback } from 'react';
import { IAdoptedLogs, adoptBlindHandler, adoptStep1Handler } from './AdoptStep';
import AdoptActionModal from 'components/AdoptActionModal';
import { AdoptActionErrorCode } from './adopt';
import { getAdoptErrorMessage } from './getErrorMessage';
import { singleMessage } from '@portkey/did-ui-react';
import { TSGRToken } from 'types/tokens';
import { AELF_TOKEN_INFO } from 'constants/assets';
import { useGetTokenPrice, useTokenPrice } from 'hooks/useAssets';
import { ONE, ZERO } from 'constants/misc';
import { useGetAllBalance } from 'hooks/useGetAllBalance';
import useLoading from 'hooks/useLoading';
import { adopt1Message, promptContentTitle } from 'constants/promptMessage';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { getDomain } from 'utils';
import { checkAIService } from 'api/request';
import { useAdoptConfirm } from './useAdoptConfirm';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { AIServerError } from 'utils/formatError';
import { renameSymbol } from 'utils/renameSymbol';
import { TModalTheme } from 'components/CommonModal';
import { AdTracker } from 'utils/ad';
import useTelegram from 'hooks/useTelegram';

const useAdoptHandler = () => {
  const adoptActionModal = useModal(AdoptActionModal);
  const { walletType } = useWebLogin();

  const promptModal = useModal(PromptModal);
  const { showLoading, closeLoading } = useLoading();
  const { tokenPrice: ELFPrice } = useTokenPrice(AELF_TOKEN_INFO.symbol);
  const asyncModal = useModal(SyncAdoptModal);
  const { isInTG } = useTelegram();

  const adoptConfirm = useAdoptConfirm();

  const getTokenPrice = useGetTokenPrice();
  const getAllBalance = useGetAllBalance();

  const getParentBalance = useCallback(
    ({ symbol, decimals, account }: { symbol: string; decimals: number; account: string }) =>
      getAllBalance([{ symbol, decimals }, AELF_TOKEN_INFO], account),
    [getAllBalance],
  );

  const adoptInput = useCallback(
    ({
      parentItemInfo,
      account,
      isDirect,
      parentPrice,
      rankInfo,
      disableInput = false,
      theme = 'light',
      isBlind,
      blindMax,
    }: {
      parentItemInfo: TSGRToken;
      account: string;
      isDirect: boolean;
      parentPrice?: string;
      rankInfo?: IRankInfo;
      disableInput?: boolean;
      theme?: TModalTheme;
      isBlind?: boolean;
      blindMax?: string;
    }): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        showLoading();
        let symbolBalance;
        let ELFBalance;
        try {
          const [symbolB, ELFB] = await getParentBalance({
            symbol: parentItemInfo.symbol,
            account,
            decimals: parentItemInfo.decimals,
          });
          symbolBalance = symbolB;
          ELFBalance = ELFB;
        } finally {
          closeLoading();
        }

        adoptActionModal.show({
          modalTitle: isDirect ? 'Instant Adopt GEN9 Cat' : 'Adopt Next-Gen Cat',
          modalSubTitle: isDirect ? 'One-click adopt for 9th-Gen Cat' : '',
          isDirect,
          disableInput,
          theme,
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation || parentItemInfo.generation === 0 ? `GEN ${parentItemInfo.generation}` : '',
            subName: renameSymbol(parentItemInfo.symbol),
            rank: rankInfo?.rank,
          },
          isBlind,
          inputProps: {
            min: ONE.div(`1e${parentItemInfo.decimals}`).toFixed(),
            max: isBlind ? blindMax : symbolBalance,
            decimals: parentItemInfo.decimals,
          },
          balanceList: [
            {
              amount: symbolBalance,
              suffix: renameSymbol(parentItemInfo.symbol) || '',
              usd: `${symbolBalance && parentPrice ? ZERO.plus(symbolBalance).times(parentPrice).toFixed(2) : '--'}`,
            },
            {
              amount: ELFBalance,
              suffix: AELF_TOKEN_INFO.symbol,
              usd: `${ELFBalance && ELFPrice ? ZERO.plus(ELFBalance).times(ELFPrice).toFixed(2) : '--'}`,
            },
          ],
          onClose: () => {
            adoptActionModal.hide();

            reject(AdoptActionErrorCode.cancel);
          },
          onConfirm: (amount: string) => {
            adoptActionModal.hide();

            resolve(amount as string);
          },
        });
      });
    },
    [ELFPrice, adoptActionModal, closeLoading, getParentBalance, showLoading],
  );

  const approveAdopt = useCallback(
    async ({
      amount,
      parentItemInfo,
      account,
      isDirect,
      theme = 'light',
      isBlind,
      adoptId,
    }: {
      account: string;
      amount: string;
      isDirect: boolean;
      parentItemInfo: TSGRToken;
      theme?: TModalTheme;
      isBlind?: boolean;
      adoptId?: string;
    }): Promise<IAdoptedLogs> =>
      new Promise((resolve, reject) => {
        promptModal.show({
          info: {
            logo: parentItemInfo.inscriptionImageUri,
            name: parentItemInfo.tokenName,
            tag: parentItemInfo.generation ? `GEN ${parentItemInfo.generation}` : '',
            subName: renameSymbol(parentItemInfo.symbol),
          },
          theme,
          title: adopt1Message.prompt.title,
          content: {
            title: promptContentTitle,
            content:
              walletType === WalletType.portkey ? [adopt1Message.prompt.portkey] : [adopt1Message.prompt.default],
          },
          initialization: async () => {
            try {
              const domain = getDomain();

              let adoptedInfo;

              if (isBlind && adoptId) {
                adoptedInfo = await adoptBlindHandler({
                  adoptId,
                });
                console.log('=====adoptBlindHandler', adoptedInfo, adoptId);
              } else {
                adoptedInfo = await adoptStep1Handler({
                  params: {
                    parent: parentItemInfo.symbol,
                    amount,
                    domain,
                  },
                  isDirect,
                  address: account,
                  decimals: parentItemInfo.decimals,
                });
              }

              AdTracker.trackEvent('adopt', {
                generation: adoptedInfo.tokenName,
                address: account,
                user_id: account,
              });
              if (isInTG) {
                AdTracker.trackEvent('tg_adopt', {
                  generation: adoptedInfo.tokenName,
                  address: account,
                  user_id: account,
                });
              }

              promptModal.hide();
              resolve(adoptedInfo);
            } catch (error) {
              console.log(error, 'error===');
              if (error === AdoptActionErrorCode.missingParams) {
                reject(error);
                return;
              }
              if (error === AdoptActionErrorCode.approveFailed) throw error;
              const errorMessage = getAdoptErrorMessage(error, 'adopt error');
              singleMessage.error(errorMessage);
              throw error;
            }
          },
          onClose: () => {
            promptModal.hide();
          },
        });
      }),
    [isInTG, promptModal, walletType],
  );

  const checkAIServer = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      const isAIserviceError = await checkAIService();

      if (!isAIserviceError) {
        resolve('continue');
        return;
      }
      asyncModal.show({
        closable: true,
        showLoading: false,
        innerText: AIServerError,
        onCancel: () => {
          asyncModal.hide();
          reject(AdoptActionErrorCode.cancel);
        },
      });
    });
  }, [asyncModal]);

  return useCallback(
    async ({
      parentItemInfo,
      account,
      isDirect,
      rankInfo,
      disableInput = false,
      theme = 'light',
      prePage,
      isBlind = false,
      adoptId: blindAdoptId,
      blindMax,
    }: {
      parentItemInfo: TSGRToken;
      account: string;
      isDirect: boolean;
      rankInfo?: IRankInfo;
      disableInput?: boolean;
      theme?: TModalTheme;
      prePage?: string;
      isBlind?: boolean;
      adoptId?: string;
      blindMax?: string;
    }) => {
      try {
        showLoading();
        const parentPrice = await getTokenPrice(parentItemInfo.symbol);
        await checkAIServer();

        closeLoading();
        const amount = await adoptInput({
          parentItemInfo,
          account,
          isDirect,
          parentPrice,
          rankInfo,
          disableInput,
          theme,
          isBlind,
          blindMax,
        });
        const { adoptId, outputAmount, symbol, tokenName, inputAmount, transactionHash } = await approveAdopt({
          amount,
          account,
          isDirect,
          parentItemInfo,
          theme,
          isBlind,
          adoptId: blindAdoptId,
        });

        await adoptConfirm({
          parentItemInfo,
          childrenItemInfo: { adoptId, symbol, outputAmount, inputAmount, tokenName, isDirect, transactionHash },
          account,
          theme,
          prePage,
        });
      } catch (error) {
        console.log(error, 'error==');
        closeLoading();
        if (error === AdoptActionErrorCode.cancel) return;
        const errorMessage = getAdoptErrorMessage(error, 'adopt error');
        singleMessage.error(errorMessage);
      }
    },
    [adoptConfirm, adoptInput, approveAdopt, checkAIServer, closeLoading, getTokenPrice, showLoading],
  );
};

export default useAdoptHandler;
