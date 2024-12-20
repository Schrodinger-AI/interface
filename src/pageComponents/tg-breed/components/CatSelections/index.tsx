/* eslint-disable @next/next/no-img-element */
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import TgModal from 'components/TgModal';
import { Tabs } from 'antd';
import styles from './index.module.css';
import CatsModule from '../CatsModule';
import CommonModal, { TModalTheme } from 'components/CommonModal';
import { TSelectedCatInfo } from '../BreedModule';
import { useMemo } from 'react';
import clsx from 'clsx';

function CatSelections({
  onConfirm,
  selectedSymbol,
  selectedType,
  theme,
}: {
  onConfirm: (data?: TSelectedCatInfo) => void;
  selectedSymbol?: string;
  selectedType?: 'myCats' | 'box';
  theme?: TModalTheme;
}) {
  const modal = useModal();
  const isDark = useMemo(() => theme === 'dark', [theme]);

  const onChange = (value: TSelectedCatInfo) => {
    onConfirm?.(value);
  };

  const modalContent = () => {
    return (
      <div className="h-full w-full flex flex-col justify-between items-center">
        <Tabs
          defaultActiveKey="1"
          className={clsx(styles['customized-tabs'], isDark ? '' : styles['customized-tabs-right'])}
          items={[
            {
              label: 'My Cat',
              key: '1',
              children: (
                <CatsModule
                  selectedSymbol={selectedSymbol}
                  selectedType={selectedType}
                  theme={theme}
                  type="myCats"
                  onChange={onChange}
                />
              ),
            },
            {
              label: 'Cat Box',
              key: '2',
              children: (
                <CatsModule
                  selectedSymbol={selectedSymbol}
                  selectedType={selectedType}
                  theme={theme}
                  type="box"
                  onChange={onChange}
                />
              ),
            },
          ]}
        />
        {/* <TGButton type="success" size="large" className="w-full mt-[24px]" onClick={() => onConfirm?.(currentData)}>
      Confirm
    </TGButton> */}
      </div>
    );
  };

  if (isDark) {
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
        {modalContent()}
      </TgModal>
    );
  } else {
    return (
      <CommonModal
        title="Select A Cat"
        open={modal.visible}
        hideHeader={false}
        maskClosable={true}
        onClose={modal.hide}
        afterClose={modal.remove}
        disableMobileLayout={true}
        className={styles['cat-selections-modal-wrap']}
        onCancel={() => modal.hide()}>
        {modalContent()}
      </CommonModal>
    );
  }
}

export default NiceModal.create(CatSelections);
