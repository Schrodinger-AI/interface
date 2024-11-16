import styles from '../style.module.css';
import React from 'react';
import { MergeCellsOutlined } from '@ant-design/icons';

function MergeItem({ checkAndRedirect }: { checkAndRedirect: (path: string) => void }) {
  return (
    <div className={styles.menuItem} onClick={() => checkAndRedirect('/breed')}>
      <MergeCellsOutlined />
      <span>Merge</span>
    </div>
  );
}

export default React.memo(MergeItem);
