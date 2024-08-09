import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import { useCallback, useMemo } from 'react';

import { useCmsInfo } from 'redux/hooks';

function AdoptRulesModal(params: { theme?: TModalTheme }) {
  const modal = useModal();
  const cmsInfo = useCmsInfo();

  const { theme = 'light' } = params || {};

  const adoptRuleList: string[] = useMemo(() => {
    return cmsInfo?.adoptRuleList || [];
  }, [cmsInfo]);

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
      title={'Adoption Rules'}
      open={modal.visible}
      onOk={onCancel}
      theme={theme}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={confirmBtn}>
      <div className="flex flex-col gap-[16px]">
        {adoptRuleList.map((item, idx) => (
          <div
            key={idx}
            className={clsx('flex flex-row', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
            <span className="mr-[4px]">{idx + 1}.</span>
            <div className="flex-1">{item}</div>
          </div>
        ))}
      </div>
    </CommonModal>
  );
}

export default NiceModal.create(AdoptRulesModal);
