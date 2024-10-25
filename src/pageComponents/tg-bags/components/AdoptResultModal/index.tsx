import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import { useCallback, useMemo } from 'react';
import { ResultModule } from '../ResultModule';
import { ITrait } from 'types/tokens';

type IProps = {
  isRare: boolean;
  traits: ITrait[];
  theme?: TModalTheme;
};

function AdoptResultModal({ isRare, traits, theme = 'dark' }: IProps) {
  const modal = useModal();

  const onCancel = useCallback(() => {
    modal.hide();
  }, [modal]);

  const confirmBtn = useMemo(
    () => (
      <Button
        className={clsx('md:w-[356px]', theme === 'dark' && '!primary-button-dark')}
        onClick={onCancel}
        type="primary">
        OK
      </Button>
    ),
    [onCancel, theme],
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
        <ResultModule traits={traits} isRare={isRare} />
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptResultModal);
