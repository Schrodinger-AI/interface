import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import { useCallback, useMemo } from 'react';
import { ResultModule } from '../ResultModule';
import { Flex } from 'antd';
import TGButton from 'components/TGButton';
import { useGetImageAndConfirm } from 'hooks/Adopt/useGetImageAndConfirm';
import { IVoucherInfo } from 'types';
import { useRouter } from 'next/navigation';

type IProps = {
  traitData?: IAdoptImageInfo;
  isRare: boolean;
  voucherInfo: IVoucherInfo;
  catsRankProbability: TRankInfoAddLevelInfo[] | false;
  theme?: TModalTheme;
  levelInfo: ILevelInfo;
};

function AdoptResultModal(props: IProps) {
  const { isRare, voucherInfo, catsRankProbability, theme = 'dark' } = props;
  const getImageAndConfirm = useGetImageAndConfirm();
  const modal = useModal();
  const router = useRouter();

  const onCancel = useCallback(() => {
    !isRare && router.push('/telegram/lucky-spin');
    modal.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, isRare]);

  const onUnbox = useCallback(() => {
    if (!voucherInfo.adoptId || !catsRankProbability || !catsRankProbability?.[0]) {
      return;
    }
    try {
      getImageAndConfirm({
        parentItemInfo: {
          tick: 'SGR',
          symbol: 'SGR-0',
          tokenName: 'SGR',
          amount: '',
          generation: 0,
          blockTime: 0,
          decimals: 0,
          inscriptionImageUri: '',
          traits: [],
        },
        childrenItemInfo: {
          adoptId: voucherInfo.adoptId,
          outputAmount: 1,
          symbol: catsRankProbability?.[0]?.levelInfo?.symbol,
          tokenName: catsRankProbability?.[0]?.levelInfo?.tokenName,
          inputAmount: 0,
          isDirect: true,
        },
        theme: 'dark',
        adoptOnly: false,
      });
    } catch (error) {
      /* empty */
    }
    onCancel();
  }, [catsRankProbability, getImageAndConfirm, onCancel, voucherInfo]);

  const confirmBtn = useMemo(
    () => (
      <Flex gap={10} className="w-full">
        <TGButton type="success" size="large" className="flex-1" onClick={onCancel}>
          {isRare ? 'Confirm' : 'Go To Spin'}
        </TGButton>
        {isRare && (
          <TGButton className="flex-1" size="large" onClick={onUnbox}>
            Unbox
          </TGButton>
        )}
      </Flex>
    ),
    [isRare, onCancel, onUnbox],
  );

  return (
    <CommonModal
      title={'Instant Adopt GEN9 Cat'}
      titleClassName="!font-black !text-pixelsWhiteBg"
      open={modal.visible}
      onOk={onCancel}
      theme={theme}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={confirmBtn}>
      <ResultModule {...props} />
    </CommonModal>
  );
}

export default NiceModal.create(AdoptResultModal);
