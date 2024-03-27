import { Dropdown } from 'aelf-design';
import styles from '../style.module.css';
import { ICompassProps } from '../type';
import { CompassLink, CompassText } from './CompassLink';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import clsx from 'clsx';
import { ReactComponent as ArrowDownIcon } from 'assets/img/arrow.svg';
import React, { useState } from 'react';

interface IProps {
  title?: string;
  schema?: string;
  items: ICompassProps[];
  onPressCompassItems: (item: ICompassProps) => void;
}

function MenuDropdown({ title, items, schema, onPressCompassItems }: IProps) {
  const [rotate, setRotate] = useState<boolean>(false);

  const onOpenChange = (open: boolean) => {
    if (open) {
      setRotate(true);
    } else {
      setRotate(false);
    }
  };

  return (
    <Dropdown
      key={title}
      overlayClassName={styles.dropdown}
      placement="bottomLeft"
      onOpenChange={onOpenChange}
      menu={{
        items: items.map((sub) => {
          return {
            key: sub.title,
            label: (
              <CompassLink
                key={sub.title}
                item={sub}
                className={clsx('text-neutralPrimary rounded-[12px] hover:text-brandHover', styles.menuItem)}
                onPressCompassItems={onPressCompassItems}
              />
            ),
          } as ItemType;
        }),
      }}>
      <span className={clsx('flex justify-center items-center', styles['menu-dropdown-title'])}>
        <CompassText title={title} schema={schema} />
        <ArrowDownIcon
          className={clsx(
            'w-[16px] h-[16px] ml-[8px] hover:fill-brandDefault transition-transform',
            styles['menu-dropdown-arrow'],
            rotate && styles.rotate,
          )}
        />
      </span>
    </Dropdown>
  );
}

export default React.memo(MenuDropdown);
