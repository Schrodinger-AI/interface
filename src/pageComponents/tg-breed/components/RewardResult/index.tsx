import winnerBg from 'assets/img/telegram/breed/winner-cloud-bg.png';
import noWinnerBg from 'assets/img/telegram/breed/no-winner-cloud-bg.png';
import winnerInfoBg from 'assets/img/telegram/breed/winner-info-bg.png';
import defaultCard from 'assets/img/telegram/breed/default-card.png';
import Image from 'next/image';
import KittenOnTheGrass from '../KittenOnTheGrass';
import SelectCard from '../SelectCard';
import clsx from 'clsx';
import { useMemo } from 'react';
import { addPrefixSuffix, getOmittedStr, OmittedType } from 'utils/addressFormatting';
import { TModalTheme } from 'components/CommonModal';
import TGButton from 'components/TGButton';
import { Button } from 'aelf-design';
import { catRedeem } from 'api/request';
import { message } from 'antd';
import { DEFAULT_ERROR, formatErrorMsg } from 'utils/formatError';
import { IContractError } from 'types';
import { useModal } from '@ebay/nice-modal-react';
import RedeemNotice from '../RedeemNotice';
import TGAdoptLoading from 'components/TGAdoptLoading';
import SyncAdoptModal from 'components/SyncAdoptModal';
import { Redeem } from 'contract/schrodinger';

const textNoWinner = 'No Winner This Round';
const textNoWinnerDesc = '80% of the Bonus Prize Pool rolls over to the next round';

function RewardResult({ winnerInfo, theme }: { winnerInfo?: IWinnerInfo; theme?: TModalTheme }) {
  const hasWinner = useMemo(() => (winnerInfo?.winnerAddress ? true : false), [winnerInfo?.winnerAddress]);
  const isDark = useMemo(() => theme === 'dark', [theme]);

  const redeemNotice = useModal(RedeemNotice);
  const tgAdoptLoading = useModal(TGAdoptLoading);
  const syncAdoptModal = useModal(SyncAdoptModal);

  const onRedeemConfirm = async () => {
    redeemNotice.hide();
    if (isDark) {
      tgAdoptLoading.show();
    } else {
      syncAdoptModal.show();
    }
    try {
      const res = await catRedeem();
      await Redeem({
        ...res,
      });
      message.success('Successfully Redeemded!');
    } catch (error) {
      message.error(
        typeof error === 'string'
          ? error
          : formatErrorMsg(error as IContractError).errorMessage.message || DEFAULT_ERROR,
      );
    } finally {
      tgAdoptLoading.hide();
      syncAdoptModal.hide();
    }
  };

  const onRedeem = async () => {
    redeemNotice.show({
      onConfirm: onRedeemConfirm,
      theme,
    });
  };

  return (
    <div className={clsx('relative z-20 w-full overflow-hidden pb-[127px]', isDark ? '-mt-[70px] pt-[50px]' : 'mt-0')}>
      {isDark ? (
        <Image src={hasWinner ? winnerBg : noWinnerBg} className="relative z-10 w-full lg:invisible" alt="" />
      ) : null}

      <div className={clsx('z-20 top-0 left-0 w-full h-full', isDark ? 'absolute pt-[110px]' : 'relative pt-[40px]')}>
        <div className="w-full h-full flex flex-col items-center">
          {hasWinner && isDark ? (
            <span className="relative z-20 text-base text-pixelsWhiteBg font-black mb-[18px]">Winner</span>
          ) : null}

          {hasWinner ? (
            <SelectCard size="large" imageUrl={winnerInfo?.winnerImage} describe={winnerInfo?.winnerDescribe} />
          ) : (
            <Image src={defaultCard} width={199} height={193} alt={''} />
          )}

          {isDark ? (
            <div className={clsx('relative z-10 mt-[12px]')}>
              <Image src={winnerInfoBg} className="w-[270px]" alt={''} />
              <span className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-sm font-black text-pixelsWhiteBg pb-[7px]">
                {winnerInfo?.winnerAddress
                  ? getOmittedStr(addPrefixSuffix(winnerInfo?.winnerAddress), OmittedType.ADDRESS)
                  : textNoWinner}
              </span>
            </div>
          ) : (
            <div
              className={clsx(
                'relative w-full z-10 p-[16px] rounded-lg bg-[#FFF5E6]',
                isDark ? 'mt-[12px]' : 'mt-[45px]',
              )}>
              <span className="font-medium text-sm flex w-full justify-center text-warning900 opacity-60">
                {hasWinner ? 'Winner' : textNoWinner}
              </span>
              <span className="font-medium text-lg flex w-full justify-center text-center text-warning900 mt-[8px]">
                {winnerInfo?.winnerAddress
                  ? getOmittedStr(addPrefixSuffix(winnerInfo?.winnerAddress), OmittedType.ADDRESS)
                  : textNoWinnerDesc}
              </span>
            </div>
          )}

          {hasWinner ? null : (
            <span className="flex text-center w-[176px] text-pixelsWhiteBg text-xs font-semibold mt-[11px]">
              {textNoWinnerDesc}
            </span>
          )}

          {hasWinner ? (
            <div className="mt-[12px]">
              {isDark ? (
                <TGButton
                  className="text-pixelsWhiteBg black-title text-base font-black w-[149px] h-[44px]"
                  onClick={() => onRedeem()}>
                  Redeem
                </TGButton>
              ) : (
                <Button type="primary" className="text-base font-black w-[149px]" onClick={() => onRedeem()}>
                  Redeem
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {isDark ? <KittenOnTheGrass hasWinner={hasWinner} className="fixed bottom-0 left-0 z-30" /> : null}
    </div>
  );
}

export default RewardResult;
