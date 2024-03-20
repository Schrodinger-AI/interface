import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import CommonModal from 'components/CommonModal';
import SkeletonImage from 'components/SkeletonImage';
import { useCallback, useMemo } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { TBaseSGRToken } from 'types/tokens';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
import { divDecimals } from 'utils/calculate';
import { openExternalLink } from 'utils/openlink';

interface ILearnMoreModalProps {
  item: TBaseSGRToken;
}

function LearnMoreModal({ item }: ILearnMoreModalProps) {
  const modal = useModal();
  const cmsInfo = useCmsInfo();

  const onCancel = useCallback(() => {
    modal.hide();
  }, [modal]);

  const onJump = useCallback(() => {
    const forestUrl = cmsInfo?.forestUrl || '';
    if (!forestUrl) return;
    // const collection = getCollection(item.symbol);
    // openExternalLink(`${forestUrl}/explore-items/${cmsInfo?.curChain}-${collection}-0`, '_blank');
    openExternalLink(`${forestUrl}/detail/buy/${cmsInfo?.curChain}-${item.symbol}/${cmsInfo?.curChain}`, '_blank');
    modal.hide();
  }, [cmsInfo?.curChain, cmsInfo?.forestUrl, item.symbol, modal]);

  const confirmBtn = useMemo(
    () => (
      <Button className="md:w-[356px]" onClick={onJump} type="primary">
        Go to Forest
      </Button>
    ),
    [onJump],
  );

  const transformedAmount = useMemo(
    () => divDecimals(item.amount, item.decimals).toFixed(),
    [item.amount, item.decimals],
  );

  return (
    <CommonModal
      title="Notice"
      width={438}
      open={modal.visible}
      onOk={onCancel}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={confirmBtn}
      disableMobileLayout={true}>
      <div className="text-neutralPrimary text-sm mb-[24px]">
        Please go to the Forest NFT marketplace to learn more about the inscription.
      </div>
      <div className="rounded-[16px] bg-[#F6F6F6] p-[12px] flex flex-row items-center">
        <SkeletonImage img={item.inscriptionImageUri} className={'w-[64px] h-[64px]'} />
        <div className="flex flex-1 ml-[16px] flex-col">
          <div>
            <div className="text-xs text-[#B8B8B8]">Name</div>
            <div className="text-sm text-neutralPrimary">{item.tokenName}</div>
          </div>
          <div>
            <div className="text-xs text-[#B8B8B8]">Symbol</div>
            <div className="text-sm text-neutralPrimary">{item.symbol}</div>
          </div>
          <div className="flex flex-row items-center mt-[4px]">
            <XIcon />
            <div className="ml-[6px] text-xs text-neutralSecondary">{transformedAmount}</div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(LearnMoreModal);
