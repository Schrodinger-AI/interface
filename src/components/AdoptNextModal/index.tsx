/* eslint-disable react/no-unescaped-entities */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import { Tooltip } from 'antd';
import Balance from 'components/Balance';
import CommonModal from 'components/CommonModal';
import TransactionFee from 'components/TransactionFee';
import NoticeBar from 'components/NoticeBar';
import SGRTokenInfo, { ISGRTokenInfoProps } from 'components/SGRTokenInfo';
import TraitsList from 'components/TraitsList';
import { ReactComponent as QuestionSVG } from 'assets/img/icons/question.svg';
import AIImageSelect from 'components/AIImageSelect';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { IAdoptNextData } from './type';
import { getRarity } from 'utils/trait';
import SkeletonImage from 'components/SkeletonImage';
import CancelAdoptModal from 'components/CancelAdoptModal';

interface IDescriptionItemProps extends PropsWithChildren {
  title: string;
  tip?: string | React.ReactNode;
}

function DescriptionItem({ title, tip, children }: IDescriptionItemProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-2">
        <div className="text-lg font-medium">{title}</div>
        {tip && (
          <Tooltip title={tip}>
            <QuestionSVG />
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
  onConfirm?: (image: string, getWatermarkImage: boolean, SGRToken?: ISGRTokenInfoProps) => void;
  onClose?: () => void;
}

function AdoptNextModal({ isAcross, data, isDirect, onConfirm, onClose, adoptId }: IAdoptNextModal) {
  const modal = useModal();
  const cancelAdoptModal = useModal(CancelAdoptModal);
  const [loading, setLoading] = useState<boolean>(false);
  const { SGRToken, allTraits, images, inheritedTraits, transaction, ELFBalance } = data;
  const [selectImage, setSelectImage] = useState<number>(images.length > 1 ? -1 : 0);

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
      nftImage: images[selectImage],
      tokenName: SGRToken.tokenName,
      amount: SGRToken.amount,
      adoptId,
    });
  }, [SGRToken.amount, SGRToken.tokenName, adoptId, cancelAdoptModal, images, selectImage]);

  const onCancel = useCallback(() => {
    if (onClose) return onClose();
    modal.hide();
  }, [modal, onClose]);

  const title = useMemo(() => {
    return (
      <div className="font-semibold">
        <div className="text-neutralTitle">{isDirect ? 'Instant Adopt GEN9 Cat' : 'Adopt Next-Gen Cat'}</div>
        {isAcross && !isDirect && (
          <div className="mt-2 text-lg text-neutralSecondary font-medium">
            Congratulations! You've triggered a<span className="text-functionalWarning">{` CROSS-LEVEL `}</span>
            adoption and your cat will gain multiple traits in this adoption.
          </div>
        )}
      </div>
    );
  }, [isAcross, isDirect]);

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

  return (
    <CommonModal
      title={title}
      closable={true}
      open={modal.visible}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={
        <div className="flex w-full justify-center">
          {images.length > 1 ? null : (
            <Button
              loading={loading}
              className="flex-1 lg:flex-none lg:w-[356px] mr-[16px] !rounded-lg border-brandDefault text-brandDefault"
              onClick={onReroll}
              type="default">
              Reroll
            </Button>
          )}
          <Button
            loading={loading}
            className="flex-1 lg:flex-none lg:w-[356px] !rounded-lg"
            disabled={selectImage < 0}
            onClick={onClick}
            type="primary">
            Confirm
          </Button>
        </div>
      }>
      <div className="flex flex-col gap-[16px] lg:gap-[32px]">
        {/* <NoticeBar text="Please don't close this window until you complete the adoption." /> */}
        <NoticeBar
          text={isDirect ? 'Congrats! You adopted a GEN9 Cat!' : 'Congrats! You adopted a Cat!'}
          type="success"
        />
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
            <SkeletonImage img={images[0]} className="w-full lg:w-[180px]" />
          </div>
        )}

        <SGRTokenInfo {...SGRToken} />
        <DescriptionItem
          title="Newly Generated Trait"
          tip={
            <>
              <div>During adoption, AI will randomly give your cat a new trait.</div>
              <br />
              <div>
                {`If your cat acquires two traits simultaneously, congratulations! You've experienced a rare cross-level
                adoption, giving your cat multiple traits at once.`}
              </div>
            </>
          }>
          <TraitsList data={newTraitsList} showNew />
        </DescriptionItem>

        {isDirect ? null : (
          <DescriptionItem title="Traits">
            <TraitsList data={allTraits} />
          </DescriptionItem>
        )}

        <TransactionFee {...transaction} />
        <Balance
          items={[
            {
              amount: `${ELFBalance?.amount ?? '--'} ELF`,
              usd: `${ELFBalance?.usd ?? '--'}`,
            },
          ]}
        />
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptNextModal);
