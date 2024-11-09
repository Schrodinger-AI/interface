/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TGButton from 'components/TGButton';
import TgModal from 'components/TgModal';
import { Tabs } from 'antd';
import styles from './index.module.css';
import CatsModule from '../CatsModule';
import { useState } from 'react';

function CatSelections({ onConfirm }: { onConfirm: (v: string) => void; onClose: () => void }) {
  const modal = useModal();
  const [symbol, setSymbol] = useState('');

  const handleClose = () => {
    modal.remove();
  };

  return (
    <TgModal
      title="Select a Cat"
      open={modal.visible}
      hideHeader={false}
      maskClosable={true}
      onClose={handleClose}
      afterClose={handleClose}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}>
      <Tabs
        defaultActiveKey="1"
        className={styles['customized-tabs']}
        items={[
          {
            label: 'My Cats',
            key: '1',
            children: <CatsModule onChange={(value) => setSymbol(value)} />,
          },
          {
            label: 'Box',
            key: '2',
            children: <CatsModule onChange={(value) => setSymbol(value)} />,
          },
        ]}
      />
      <TGButton type="success" size="large" className="w-full mt-[24px]" onClick={() => onConfirm?.(symbol)}>
        Confirm
      </TGButton>
    </TgModal>
  );
}

export default NiceModal.create(CatSelections);
