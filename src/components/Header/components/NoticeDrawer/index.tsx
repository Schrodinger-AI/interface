import { Drawer, DrawerProps } from 'antd';
import NoticeScrollList from 'components/NoticeScrollList';
import React from 'react';
import styles from './style.module.css';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';

function NoticeDrawer(props: DrawerProps) {
  return (
    <Drawer
      {...props}
      rootClassName={styles['notice-drawer']}
      width={438}
      title="Notifications"
      destroyOnClose
      closeIcon={false}
      extra={
        <div className="h-full px-[6px] cursor-pointer" onClick={props.onClose}>
          <CloseSVG className="w-[24px] h-[24px]" />
        </div>
      }>
      <NoticeScrollList />
    </Drawer>
  );
}

export default React.memo(NoticeDrawer);
