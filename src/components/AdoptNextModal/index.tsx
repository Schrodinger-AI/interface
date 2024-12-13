/* eslint-disable react/no-unescaped-entities */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import { Tooltip } from 'antd';
import Balance from 'components/Balance';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import TransactionFee from 'components/TransactionFee';
import NoticeBar from 'components/NoticeBar';
import SGRTokenInfo, { ISGRTokenInfoProps } from 'components/SGRTokenInfo';
import TraitsList from 'components/TraitsList';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import { ReactComponent as VoucherSVG } from 'assets/img/telegram/home/voucher.svg';
import { ReactComponent as AddGoldSVG } from 'assets/img/telegram/gold.svg';
import AIImageSelect from 'components/AIImageSelect';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { IAdoptNextData } from './type';
import { getRarity } from 'utils/trait';
import SkeletonImage from 'components/SkeletonImage';
import CancelAdoptModal from 'components/CancelAdoptModal';
import useTelegram from 'hooks/useTelegram';
import clsx from 'clsx';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { timesDecimals } from 'utils/calculate';
import { getBlindCatDetail } from 'api/request';
import { useCmsInfo } from 'redux/hooks';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

const boxRare = 'Congrats! You got a Rare Cat Box!';
const boxNormal = 'Congrats! You got a Cat Box!';
const isAcrossBoxRare = 'Congrats! You got a Rare Cat Box that evolved 2-Gen at a time!';
const isAcrossBoxNormal = 'Congrats! You got a Common Cat Box that evolved 2-Gen at a time!';

interface IDescriptionItemProps extends PropsWithChildren {
  title: string;
  theme?: TModalTheme;
  tip?: string | React.ReactNode;
}

function DescriptionItem({ title, tip, children, theme }: IDescriptionItemProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-2">
        <div className={clsx('text-lg font-medium', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
          {title}
        </div>
        {tip && (
          <Tooltip title={tip}>
            <QuestionSVG className="fill-pixelsWhiteBg" />
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
}

interface IAdoptNextModal {
  isAcross?: boolean;
  isDirect?: boolean;
  data: IAdoptNextData;
  adoptId: string;
  theme?: TModalTheme;
  isBlind?: boolean;
  hideNext?: boolean;
  onConfirm?: (image: string, getWatermarkImage: boolean, SGRToken?: ISGRTokenInfoProps) => void;
  onClose?: () => void;
}

function AdoptNextModal({
  isAcross,
  data,
  isDirect,
  onConfirm,
  onClose,
  adoptId,
  theme,
  isBlind = false,
  hideNext = false,
}: IAdoptNextModal) {
  const modal = useModal();
  const cancelAdoptModal = useModal(CancelAdoptModal);
  const [loading, setLoading] = useState<boolean>(false);
  const { SGRToken, allTraits, images, inheritedTraits, transaction, ELFBalance } = data;
  const [selectImage, setSelectImage] = useState<number>(images.length > 1 ? -1 : 0);
  const adoptHandler = useAdoptHandler();
  const { walletInfo } = useConnectWallet();
  const cmsInfo = useCmsInfo();
  const [nextLoading, setNextLoading] = useState<boolean>(false);

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const generation = useMemo(() => {
    return data?.SGRToken.tokenName?.split('GEN')[1];
  }, [data?.SGRToken.tokenName]);

  const onSelect = useCallback((index: number) => {
    setSelectImage(index);
  }, []);

  const onClick = useCallback(() => {
    setLoading(true);
    onConfirm?.(images[selectImage], images.length > 1, SGRToken);
  }, [SGRToken, images, onConfirm, selectImage]);

  const onReroll = useCallback(() => {
    cancelAdoptModal.show({
      title: 'Reroll',
      amount: SGRToken.amount,
      nftInfo: {
        nftImage: images[selectImage],
        tokenName: SGRToken.tokenName || '',
        symbol: SGRToken.symbol || '',
        generation: Number(generation),
      },
      adoptId,
      theme,
    });
  }, [cancelAdoptModal, SGRToken, images, selectImage, generation, adoptId, theme]);

  const onAdoptNext = async () => {
    try {
      if (!(data.SGRToken.symbol && data.SGRToken.tokenName && data.SGRToken.amount)) return;
      const amount = String(timesDecimals(data.SGRToken.amount, 8));
      setNextLoading(true);
      const result = await getBlindCatDetail({
        symbol: data.SGRToken.symbol,
        chainId: cmsInfo?.curChain || '',
        address: walletInfo?.address,
      });
      setNextLoading(false);
      modal.hide();
      adoptHandler({
        parentItemInfo: {
          tick: '',
          symbol: data.SGRToken.symbol,
          tokenName: data.SGRToken.tokenName,
          amount,
          generation: Number(generation),
          blockTime: 0,
          decimals: 8,
          inscriptionImageUri: data.images[0],
          traits: data.allTraits,
        },
        blindMax: String(data.SGRToken.amount),
        isBlind: true,
        account: walletInfo?.address || '',
        isDirect: false,
        theme: theme,
        prePage: 'adoptModal',
        adoptId: result.adoptId,
      });
    } catch (error) {
      setNextLoading(false);
    }
  };

  const onCancel = useCallback(() => {
    if (onClose) return onClose();
    modal.hide();
  }, [modal, onClose]);

  const { isInTG } = useTelegram();

  const title = useMemo(() => {
    return (
      <div className="font-semibold">
        <div className={clsx(isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
          {isDirect ? 'Instant Adopt GEN9 Cat' : 'Adopt Next-Gen Cat'}
        </div>
        {isAcross && !isDirect && !isBlind && (
          <div className="mt-2 text-lg text-neutralSecondary font-medium">
            Congratulations! You've triggered a<span className="text-functionalWarning">{` CROSS-LEVEL `}</span>
            adoption and your cat will gain multiple traits in this adoption.
          </div>
        )}
      </div>
    );
  }, [isAcross, isDirect, isDark, isBlind]);

  const newTraitsList = useMemo(() => {
    const inheritedMap: Record<string, string> = {};
    inheritedTraits.forEach((trait) => {
      inheritedMap[trait.traitType] = trait.value;
    });
    return allTraits.filter((item) => !inheritedMap[item.traitType]);
  }, [allTraits, inheritedTraits]);

  useEffect(() => {
    try {
      const traitTypeList = allTraits.map((item) => item.traitType.trim());
      const valueList = allTraits.map((item) => item.value.trim());
      getRarity(traitTypeList, valueList);
    } catch (error) {
      console.error('getRarity error:', error);
    }
  }, [allTraits]);

  const isRare = useMemo(() => {
    const describe = data?.SGRToken?.rankInfo?.levelInfo?.describe;
    const describeRarity = data?.SGRToken?.rankInfo?.levelInfo?.describe
      ? data?.SGRToken?.rankInfo?.levelInfo?.describe.split(',')[0]
      : '';
    return describe && describeRarity !== 'Common';
  }, [data?.SGRToken?.rankInfo?.levelInfo?.describe]);

  const noticeText = useMemo(() => {
    const showAcross = isAcross && !isDirect;

    if (isBlind) {
      if (isRare) {
        return showAcross ? isAcrossBoxRare : boxRare;
      } else {
        return showAcross ? isAcrossBoxNormal : boxNormal;
      }
    } else {
      return 'Congratulations! Your Cat is ready for adoption.';
    }
  }, [isAcross, isBlind, isDirect, isRare]);

  return (
    <CommonModal
      title={title}
      closable={true}
      open={modal.visible}
      onCancel={onCancel}
      theme={theme}
      afterClose={modal.remove}
      footer={
        <div className="flex w-full justify-center px-0 lg:px-[32px] gap-[8px] lg:gap-[16px]">
          {images.length > 1 ? null : (
            <Button
              loading={loading}
              className={clsx(
                'flex-1',
                theme === 'dark' ? '!default-button-dark' : '!rounded-lg border-brandDefault text-brandDefault',
              )}
              onClick={onReroll}
              type="default">
              Reroll
            </Button>
          )}
          <Button
            loading={loading}
            className={clsx(
              'flex-1',
              theme === 'dark' ? '!default-button-dark' : '!rounded-lg border-brandDefault text-brandDefault',
            )}
            disabled={selectImage < 0}
            onClick={onClick}
            type="default">
            {isBlind ? 'Unbox' : 'Confirm'}
          </Button>
          {!isDirect && generation !== '9' && !hideNext ? (
            <Button
              loading={nextLoading}
              className={clsx('flex-1', theme === 'dark' ? '!primary-button-dark' : '!rounded-lg')}
              disabled={selectImage < 0}
              onClick={onAdoptNext}
              type="primary">
              Next-Gen
            </Button>
          ) : null}
        </div>
      }>
      <div className="flex flex-col gap-[16px] lg:gap-[32px]">
        <div>
          <NoticeBar text={noticeText} type="success" theme={theme} />
          <NoticeBar
            text={noticeText}
            type="custom"
            theme={theme}
            className="my-[6px]"
            icon={<VoucherSVG className="w-[28px] h-[17px]" />}
          />
          <NoticeBar
            text={noticeText}
            type="custom"
            theme={theme}
            icon={<AddGoldSVG className="w-[28px] h-[28px]" />}
          />
        </div>

        {images.length > 1 ? (
          <DescriptionItem title="Select the Cat You Prefer">
            <span className="text-functionalWarning text-base">
              Please note: Once you confirm, the adoption will be completed, and you won't be able to change the cat
              anymore.
            </span>
            <AIImageSelect list={images} onSelect={onSelect} />
          </DescriptionItem>
        ) : (
          <div className="w-full flex justify-center items-center">
            <SkeletonImage
              img={images[0]}
              className="w-full lg:w-[180px]"
              generation={isInTG && isDirect ? '9' : generation}
              rank={data?.SGRToken?.rankInfo?.rank}
              rarity={data?.SGRToken?.rankInfo?.levelInfo?.describe}
              level={data?.SGRToken?.rankInfo?.levelInfo?.level}
              specialTrait={data?.SGRToken?.rankInfo?.levelInfo?.specialTrait}
            />
          </div>
        )}

        <SGRTokenInfo {...SGRToken} theme={theme} />
        <DescriptionItem
          title="Newly Generated Trait"
          theme={theme}
          tip={
            <>
              <div className={clsx(isDark ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
                During adoption, AI will randomly give your cat a new trait.
              </div>
              <br />
              <div>
                {`If your cat acquires two traits simultaneously, congratulations! You've experienced a rare cross-level
                adoption, giving your cat multiple traits at once.`}
              </div>
            </>
          }>
          <TraitsList data={newTraitsList} showNew theme={theme} />
        </DescriptionItem>

        {isDirect ? null : (
          <DescriptionItem title="Traits" theme={theme}>
            <TraitsList data={allTraits} theme={theme} />
          </DescriptionItem>
        )}

        <TransactionFee {...transaction} theme={theme} />
        <Balance
          items={[
            {
              amount: `${ELFBalance?.amount ?? '--'} ELF`,
              usd: `${ELFBalance?.usd ?? '--'}`,
            },
          ]}
          theme={theme}
        />
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptNextModal);
