import { Drawer, DrawerProps } from 'antd';
import React from 'react';
import styles from './style.module.css';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import EventScrollList from 'components/EventScrollList';

function EventListDrawer(props: DrawerProps) {
  return (
    <Drawer
      {...props}
      rootClassName={styles['event-drawer']}
      width={438}
      title="Events"
      destroyOnClose
      closeIcon={false}
      extra={
        <div className="h-full px-[6px] cursor-pointer" onClick={props.onClose}>
          <CloseSVG className="w-[24px] h-[24px]" />
        </div>
      }>
      <EventScrollList />
    </Drawer>
  );
}

export default React.memo(EventListDrawer);
