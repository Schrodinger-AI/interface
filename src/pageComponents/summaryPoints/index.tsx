import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import styles from './style.module.css';
import useGetPointsData from 'pageComponents/points/hooks/useGetPointsData';
import TokenEarnCard from 'pageComponents/points/components/TokenEarnCard';
import { useCmsInfo } from 'redux/hooks';

export default function SummaryPoints() {
  const { data } = useGetPointsData();

  const cmsInfo = useCmsInfo();

  return (
    <div className={clsx(styles['summary-points-wrap'])}>
      <BackCom theme="dark" />
      {!cmsInfo?.hideTgSummaryPoints ? (
        <div className={clsx(styles['card-wrap'])}>
          <div className={clsx(styles['card-title'])}>My Points</div>
          <div className="flex gap-[16px]">
            <div className={clsx(styles['summary-card'])}>
              <span className={clsx(styles['summary-value'])}>{data?.totalReward || '--'}</span>
              <span className={clsx(styles['summary-title'])}>Estimated $SGR Reward</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className={clsx(styles['card-wrap'])}>
        <div className={clsx(styles['card-title'])}>Points Details</div>
        <TokenEarnCard pointDetails={data?.pointDetails || []} theme="dark" />
      </div>
    </div>
  );
}
