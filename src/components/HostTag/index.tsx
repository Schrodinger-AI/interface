'use client';
import { Modal, Button, Tooltip } from 'antd';
import { getSecondHostName, dotString } from 'utils/common';
import { useMemo, useState } from 'react';
import { isMobileDevices } from 'utils/isMobile';
import { useResponsive } from 'ahooks';
import styles from './style.module.css';

export function NavHostTag() {
  const [open, setOpen] = useState(false);
  const hostName = useMemo(() => getSecondHostName(), []);
  const isMobile = useMemo(() => !!isMobileDevices(), []);
  const responsive = useResponsive();

  const hostStr = useMemo(() => dotString(hostName, isMobile ? 10 : 16), [hostName, isMobile]);

  return (
    <>
      {hostName && (
        <>
          <div className={styles.navHostTag} onClick={() => setOpen(true)}>
            {responsive.md ? (
              <Tooltip color="black" title={hostName} overlayInnerStyle={{ color: 'white' }}>
                {hostStr}
              </Tooltip>
            ) : (
              hostStr
            )}
          </div>
          {responsive.md ? null : (
            <Modal
              centered
              open={open}
              footer={
                <Button type="primary" className={styles.modalBtn} onClick={() => setOpen(false)}>
                  OK
                </Button>
              }
              onCancel={() => setOpen(false)}>
              {hostName}
            </Modal>
          )}
        </>
      )}
    </>
  );
}

export function HomeHostTag() {
  const [open, setOpen] = useState(false);
  const hostName = useMemo(() => getSecondHostName(), []);
  const isMobile = useMemo(() => !!isMobileDevices(), []);
  const responsive = useResponsive();

  const hostStr = useMemo(() => 'Invited by ' + dotString(hostName, isMobile ? 10 : 16), [hostName, isMobile]);

  return (
    <>
      {hostName && (
        <>
          <div className={styles.homeHostTag} onClick={() => setOpen(true)}>
            {responsive.md ? (
              <Tooltip title={hostName} color="black" overlayInnerStyle={{ color: 'white' }}>
                {hostStr}
              </Tooltip>
            ) : (
              hostStr
            )}
          </div>
          {responsive.md ? null : (
            <Modal
              title="Invited by"
              centered
              open={open}
              footer={
                <Button type="primary" className={styles.modalBtn} onClick={() => setOpen(false)}>
                  OK
                </Button>
              }
              onCancel={() => setOpen(false)}>
              {hostName}
            </Modal>
          )}
        </>
      )}
    </>
  );
}
