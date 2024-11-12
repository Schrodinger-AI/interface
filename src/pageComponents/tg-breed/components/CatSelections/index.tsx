/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Tabs } from 'antd';
import styles from './index.module.css';
import CatsModule from '../CatsModule';
import { useState } from 'react';
import { TSGRItem } from 'types/tokens';
import { TModalTheme } from 'components/CommonModal';

function CatSelections({
  onConfirm,
  currentSymbol,
  theme,
}: {
  onConfirm: (data?: TSGRItem) => void;
  currentSymbol?: string;
  theme?: TModalTheme;
}) {
  const modal = useModal();

  const [currentData, setCurrentData] = useState<TSGRItem>();

  return (
    <TgModal
      title="Select a Cat"
      open={modal.visible}
      hideHeader={false}
      maskClosable={true}
      onClose={modal.hide}
      afterClose={modal.remove}
      onCancel={() => modal.hide()}>
      <Tabs
        defaultActiveKey="1"
        className={styles['customized-tabs']}
        items={[
          {
            label: 'My Cats',
            key: '1',
            children: (
              <CatsModule
                currentSymbol={currentSymbol}
                theme={theme}
                type="myCats"
                onChange={(value) => setCurrentData(value)}
              />
            ),
          },
          {
            label: 'Box',
            key: '2',
            children: (
              <CatsModule
                currentSymbol={currentSymbol}
                theme={theme}
                type="box"
                onChange={(value) => setCurrentData(value)}
              />
            ),
          },
        ]}
      />
      <TGButton type="success" size="large" className="w-full mt-[24px]" onClick={() => onConfirm?.(currentData)}>
        Confirm
      </TGButton>
    </TgModal>
  );
}

export default NiceModal.create(CatSelections);
