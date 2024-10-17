/* eslint-disable react/no-unescaped-entities */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import { message } from 'antd';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import { useCallback, useMemo, useState } from 'react';
import SkeletonImage from 'components/SkeletonImage';
import { IContractError } from 'types';
import { RerollAdoption } from 'contract/schrodinger';
import AdoptNextModal from 'components/AdoptNextModal';
import clsx from 'clsx';
import { UserDeniedMessage } from 'utils/formatError';
import CardResultModal, { Status } from 'components/CardResultModal';
import { resetSGRMessage } from 'constants/promptMessage';
import { getOriginSymbol } from 'utils';
import { renameSymbol } from 'utils/renameSymbol';
import useIntervalGetSchrodingerDetail from 'hooks/Adopt/useIntervalGetSchrodingerDetail';
import { useRouter } from 'next/navigation';
import useTelegram from 'hooks/useTelegram';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

function CancelAdoptModal({
  nftInfo,
  title,
  amount,
  adoptId,
  theme = 'light',
  source,
  prePage,
}: {
  nftInfo: {
    nftImage: string;
    tokenName: string;
    symbol: string;
    generation: number;
  };
  title: string;
  amount: string | number;
  adoptId: string;
  theme?: TModalTheme;
  source?: string;
  prePage?: string;
}) {
  const modal = useModal();
  const adoptNextModal = useModal(AdoptNextModal);
  const cardResultModal = useModal(CardResultModal);
  const [loading, setLoading] = useState<boolean>(false);
  const intervalFetch = useIntervalGetSchrodingerDetail();
  const router = useRouter();
  const { walletInfo } = useConnectWallet();
  const { isInTG } = useTelegram();

  const originSymbol = useMemo(() => getOriginSymbol(nftInfo.symbol), [nftInfo.symbol]);

  const onCancel = () => {
    modal.hide();
  };

  const rerollSuccess = useCallback(async () => {
    if (originSymbol) {
      await intervalFetch.start(originSymbol);
      intervalFetch.remove();
      cardResultModal.hide();
      router.replace(
        `/detail?symbol=${originSymbol}&from=my&address=${walletInfo?.address}&source=${source}&prePage=${prePage}`,
      );
    } else {
      if (isInTG) {
        router.replace('/telegram/home');
      } else {
        router.replace('/');
      }
    }
  }, [cardResultModal, isInTG, intervalFetch, originSymbol, prePage, router, source, walletInfo?.address]);

  const showResultModal = useCallback(
    ({ status, onConfirm }: { status: Status; onConfirm: () => void }) => {
      const successBtnText = originSymbol ? `View ${renameSymbol(originSymbol)}` : 'View';
      cardResultModal.show({
        modalTitle: status === Status.ERROR ? resetSGRMessage.error.title : resetSGRMessage.success.title,
        theme,
        info: {
          name: nftInfo.tokenName,
          symbol: renameSymbol(nftInfo.symbol),
          generation: nftInfo.generation,
        },
        symbol: renameSymbol(nftInfo.symbol),
        image: nftInfo.nftImage,
        id: 'sgr-reset-modal',
        status: status,
        description: status === Status.ERROR ? resetSGRMessage.error.description : resetSGRMessage.success.description,
        onCancel: () => {
          cardResultModal.hide();
        },
        buttonInfo: {
          btnText: status === Status.ERROR ? resetSGRMessage.error.button : successBtnText,
          openLoading: true,
          onConfirm,
        },
      });
    },
    [cardResultModal, nftInfo.generation, nftInfo.nftImage, nftInfo.symbol, nftInfo.tokenName, originSymbol, theme],
  );

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await RerollAdoption(adoptId);
      modal.hide();
      adoptNextModal.hide();
      showResultModal({
        status: Status.SUCCESS,
        onConfirm: rerollSuccess,
      });
      setLoading(false);
    } catch (error) {
      const resError = error as IContractError;
      setLoading(false);
      modal.hide();
      if (!resError.errorMessage?.message.includes(UserDeniedMessage)) {
        adoptNextModal.hide();
        showResultModal({
          status: Status.ERROR,
          onConfirm: onConfirm,
        });
      }
      message.error(resError.errorMessage?.message);
    }
  }, [adoptId, adoptNextModal, modal, rerollSuccess, showResultModal]);

  return (
    <CommonModal
      title={title}
      closable={true}
      open={modal.visible}
      onCancel={onCancel}
      afterClose={modal.remove}
      disableMobileLayout={true}
      theme={theme}
      footer={
        <div className="flex w-full justify-center">
          <Button
            className={clsx(
              'flex-1 lg:flex-none lg:w-[356px] mr-[16px]',
              theme === 'dark' ? '!default-button-dark' : '!rounded-lg border-brandDefault text-brandDefault',
            )}
            onClick={onCancel}
            type="default">
            Cancel
          </Button>
          <Button
            loading={loading}
            className={clsx(
              'flex-1 lg:flex-none lg:w-[356px]',
              theme === 'dark' ? '!primary-button-dark' : '!rounded-lg',
            )}
            onClick={onConfirm}
            type="primary">
            Confirm
          </Button>
        </div>
      }>
      <div className="w-full flex justify-center items-center">
        <SkeletonImage img={nftInfo.nftImage} className="w-[180px]" />
      </div>
      <p
        className={clsx(
          'text-base lg:text-2xl font-medium text-center mt-[16px] lg:mt-[32px]',
          theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle',
        )}>
        Are you sure you want to reroll {nftInfo.tokenName} to claim {amount} $SGR?
      </p>
      <p
        className={clsx(
          'text-sm lg:text-xl text-center mt-[16px] lg:mt-[32px]',
          theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary',
        )}>
        If you reroll, your NFT will be burnt and converted into $SGR. This action cannot be undone.
      </p>
    </CommonModal>
  );
}

export default NiceModal.create(CancelAdoptModal);
