import { Modal } from 'antd';
import useTelegram from 'hooks/useTelegram';
import { useEffect, useState } from 'react';
import { useGetIndexLoadingStatus, useGetPercentFinish } from 'redux/hooks';
import { setPercentFinish, setShowIndexLoading } from 'redux/reducer/loginStatus';
import { store } from 'redux/store';
import styles from './style.module.css';
import Image from 'next/image';
import loadingBackground from 'assets/img/telegram/home/loading-background.jpg';
import cat from 'assets/img/telegram/breed/cat.png';
import CommonProgress from 'components/CommonProgress';
import useGetProgressPercent from 'hooks/useGetProgressPercent';
import { sleep } from '@portkey/utils';
import HomeTreasure from 'assets/animations/homepage_treasure_box.json';
import Lottie from 'lottie-react';
import { ENVIRONMENT } from 'constants/url';

const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

export const showIndexLoading = async () => {
  store.dispatch(setShowIndexLoading(true));
};

export const hideIndexLoading = async () => {
  store.dispatch(setPercentFinish(true));
  await sleep(500);
  store.dispatch(setShowIndexLoading(false));
  store.dispatch(setPercentFinish(false));
};

function IndexLoading() {
  const open = useGetIndexLoadingStatus();
  const percentFinish = useGetPercentFinish();

  const { isInTG } = useTelegram();
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    setVisible(!!(open && isInTG));
  }, [open, isInTG]);
  const { percent, resetPercent, onFinish } = useGetProgressPercent();

  useEffect(() => {
    if (visible) {
      resetPercent();
    }
  }, [resetPercent, visible]);

  useEffect(() => {
    if (percentFinish) {
      onFinish();
    }
  }, [onFinish, percentFinish]);

  return (
    <Modal
      open={visible}
      className={styles['index-loading-wrap']}
      closable={env === 'test' ? true : false}
      destroyOnClose={true}
      onCancel={() => hideIndexLoading()}
      footer={null}>
      <div className="relative w-full h-full">
        <Image src={loadingBackground} className="w-full h-full object-cover" alt="" />
        <div className="absolute w-full h-max bottom-[30%] flex items-center justify-center">
          <div className="w-[232px]">
            <Image src={cat} className="w-[50px] rotate-y-180" alt="" />
            <CommonProgress percent={percent} />
          </div>
        </div>
        <div className="w-full absolute bottom-0 left-0 flex justify-center items-center">
          <Lottie animationData={HomeTreasure} autoPlay={true} loop={true} className="w-[30%]" />
        </div>
      </div>
    </Modal>
  );
}

export default IndexLoading;
