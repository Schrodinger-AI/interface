import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { ReactComponent as ConfirmSVG } from 'assets/img/telegram/spin/Confirm.svg';
import { ReactComponent as UnboxSVG } from 'assets/img/telegram/spin/Unbox.svg';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import { useCallback, useMemo } from 'react';
import { ResultModule } from '../ResultModule';
import { ITrait } from 'types/tokens';
import { Flex } from 'antd';
import TGButton from 'components/TGButton';

type IProps = {
  traitData?: IAdoptImageInfo;
  isRare: boolean;
  traits: ITrait[];
  theme?: TModalTheme;
};

function AdoptResultModal(props: IProps) {
  const { isRare, theme = 'dark' } = props;
  const modal = useModal();

  const onCancel = useCallback(() => {
    modal.hide();
  }, [modal]);

  const confirmBtn = useMemo(
    () => (
      <Flex gap={10} className="w-full">
        <TGButton type="success" className="flex-1">
          <ConfirmSVG />
        </TGButton>
        {isRare && (
          <TGButton className="flex-1">
            <UnboxSVG />
          </TGButton>
        )}
      </Flex>
    ),
    [isRare],
  );

  return (
    <CommonModal
      title={'Instant Adopt GEN9 Cat'}
      open={modal.visible}
      onOk={onCancel}
      theme={theme}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={confirmBtn}>
      <div className="flex flex-col gap-[16px]">
        <ResultModule {...props} />
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptResultModal);
