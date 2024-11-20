import { Progress } from 'aelf-design';
import clsx from 'clsx';
import styles from './index.module.css';

function CommonProgress({
  percent,
  status = 'active',
}: {
  percent: number;
  status?: 'active' | 'normal' | 'exception' | 'success';
}) {
  return (
    <div className={clsx('bg-pixelsWhiteBg px-[4px] py-[3px] rounded-full', styles['common-progress-wrap'])}>
      <Progress percent={percent} status={status} strokeColor={'#615DF4'} />
    </div>
  );
}

export default CommonProgress;
