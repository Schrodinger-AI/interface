/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TgModal from 'components/TgModal';
import { Tabs } from 'antd';
import styles from './index.module.css';
import CatsModule from '../CatsModule';
import { TModalTheme } from 'components/CommonModal';
import { TSelectedCatInfo } from '../BreedModule';

function CatSelections({
  onConfirm,
  currentSymbol,
  theme,
}: {
  onConfirm: (data?: TSelectedCatInfo) => void;
  currentSymbol?: string;
  theme?: TModalTheme;
}) {
  const modal = useModal();

  const onChange = (value: TSelectedCatInfo) => {
    onConfirm?.(value);
  };

  return (
    <TgModal
      title="Select A Cat"
      open={modal.visible}
      hideHeader={false}
      maskClosable={true}
      onClose={modal.hide}
      afterClose={modal.remove}
      className={styles['cat-selections-modal-wrap']}
      onCancel={() => modal.hide()}>
      <div className="h-full w-full flex flex-col justify-between items-center">
        <Tabs
          defaultActiveKey="1"
          className={styles['customized-tabs']}
          items={[
            {
              label: 'My Cat',
              key: '1',
              children: <CatsModule currentSymbol={currentSymbol} theme={theme} type="myCats" onChange={onChange} />,
            },
            {
              label: 'Cat Box',
              key: '2',
              children: <CatsModule currentSymbol={currentSymbol} theme={theme} type="box" onChange={onChange} />,
            },
          ]}
        />
        {/* <TGButton type="success" size="large" className="w-full mt-[24px]" onClick={() => onConfirm?.(currentData)}>
          Confirm
        </TGButton> */}
      </div>
    </TgModal>
  );
}

export default NiceModal.create(CatSelections);
