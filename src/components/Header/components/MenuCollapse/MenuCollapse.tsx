import { Collapse } from 'aelf-design';
import { ICompassProps } from '../../type';
import React, { ReactElement } from 'react';
import { ReactComponent as ArrowIcon } from 'assets/img/right_arrow.svg';
import styles from './style.module.css';

interface IProps {
  title: ReactElement;
  item: ICompassProps;
  onPressCompassItems: (item: ICompassProps) => void;
}

function MenuCollapse({ title, item, onPressCompassItems }: IProps) {
  return (
    <Collapse
      ghost
      className={styles['menu-collapse']}
      items={[
        {
          key: item.title,
          label: title,
          children: item?.items?.map((sub) => {
            return (
              <div
                className="h-[56px] pr-[16px] pl-[40px] flex items-center justify-between"
                key={sub.title}
                onClick={() => onPressCompassItems(sub)}>
                <span className="text-base font-medium text-neutralTitle">{sub.title}</span>
                <ArrowIcon className="size-[14px]" />
              </div>
            );
          }),
        },
      ]}
    />
  );
}

export default React.memo(MenuCollapse);
