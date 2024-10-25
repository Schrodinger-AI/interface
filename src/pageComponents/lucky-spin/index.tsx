'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.module.css';
import { ILuckyWheelPrizes, LuckyWheel } from '@lucky-canvas/react';
import clsx from 'clsx';
import BalanceModule from 'pageComponents/tg-home/components/BalanceModule';
import useBalanceService from 'pageComponents/tg-home/hooks/useBalanceService';
import spinBg from 'assets/img/telegram/spin/spin-bg.png';
import { ReactComponent as SpinArrow } from 'assets/img/telegram/spin/spin-arrow.svg';
import { ReactComponent as SpinRibbon } from 'assets/img/telegram/spin/ribbon.svg';
import Image from 'next/image';
import { defaultConfig, spinBlocks, spinCenterButtons } from './config';
import TGButton from 'components/TGButton';
import useLoading from 'hooks/useLoading';
import { getSpinPrizes, toSpin } from 'api/request';
import { Spin } from 'contract/schrodinger';
import { message } from 'antd';
import ProtoInstance from 'utils/initializeProto';
import { IAdoptedLogs } from 'hooks/Adopt/AdoptStep';
import { useCmsInfo } from 'redux/hooks';
import { sleep } from '@portkey/utils';
import BigNumber from 'bignumber.js';
import MobileBackNav from 'components/MobileBackNav';
import { numberOfFishConsumedInDraw } from 'constants/common';
import { SpinRewardType } from 'types/misc';
import { useModal } from '@ebay/nice-modal-react';
import NoticeModal from './components/NoticeModal';
import SpinResultModal from './components/SpinResultModal';

export default function Spinner() {
  const { balanceData, fish, refresh, updatePoints } = useBalanceService();
  const { showLoading, closeLoading } = useLoading();
  const cmsInfo = useCmsInfo();
  const [spinInfo, setSpinInfo] = useState<any>();
  const noticeModal = useModal(NoticeModal);
  const spinResultModal = useModal(SpinResultModal);
  const [spinDisabled, setSpinDisabled] = useState<boolean>(false);

  const [spinPrizes, setSpinPrizes] = useState<ILuckyWheelPrizes[]>([]);

  const drawsCounts = useMemo(() => {
    return BigNumber(fish).dividedToIntegerBy(numberOfFishConsumedInDraw).toNumber();
  }, [fish]);

  const getSpinInfo = async (params: ISpin) => {
    const contractAddress = cmsInfo?.schrodingerSideAddress;
    if (!contractAddress) return;
    await sleep(1000);
    const currentFish = BigNumber(fish).minus(100).toNumber();
    updatePoints(currentFish);
    // TODO
    // const result = await Spin(params);
    // const TransactionResult = result.TransactionResult;
    // const logs = await ProtoInstance.getLogEventResult<IAdoptedLogs>({
    //   contractAddress,
    //   logsName: 'Adopted',
    //   TransactionResult,
    // });
    // if (!logs) return;
    // return { ...logs, transactionHash: TransactionResult.TransactionId || TransactionResult.transactionId };
    // TODO: mock
    return {
      spin_id: '1',
      name: 'item1',
      type: '2',
      amount: '3',
      account: 'nduwe3u',
    };
  };

  const onSpin = async () => {
    try {
      console.log('=====setSpinDisabled');
      if (drawsCounts <= 0) {
        noticeModal.show();
        return;
      }
      if (!myLucky.current) return;
      myLucky.current.play();
      setSpinDisabled(true);
      // TODO: mock
      // const res = await toSpin();
      await sleep(1000);
      // TODO: mock
      const res = {
        signature: '0dsbfjwe23ds',
        seed: '1221',
        tick: 'string',
        expirationTime: 1730851200,
        type: SpinRewardType.Point,
        amount: 2,
      };
      if (res.signature) {
        const info = await getSpinInfo(res);
        if (info) {
          console.log('=====info', info);
          myLucky.current.stop(2);
          setSpinInfo(info);
        }
      }
    } catch (error) {
      console.log('=====error', error);
      if (!myLucky.current) return;
      myLucky.current.stop(0);
    }
  };

  const showResultModal = async () => {
    await sleep(300);
    spinResultModal.show({
      type: spinInfo.type,
      amount: spinInfo.amount,
      tick: spinInfo.tick,
      onSpin,
    });
    setSpinInfo(undefined);
  };

  const myLucky = useRef<{
    play: () => {};
    stop: (index: number) => {};
  }>();

  const getPrizes = useCallback(async () => {
    try {
      showLoading();
      const { data } = await getSpinPrizes();
      setSpinPrizes(data || []);
    } finally {
      closeLoading();
    }
  }, [closeLoading, showLoading]);

  const spinOnEnd = (prize: ILuckyWheelPrizes) => {
    console.log('=====onEnd prize', prize);
    if (spinInfo) {
      showResultModal();

      if (spinInfo.type === SpinRewardType.Point) {
        const currentFish = BigNumber(fish).minus(spinInfo.amount).toNumber();
        updatePoints(currentFish);
      }
    } else {
      message.error('Failure! Please try again.');
    }

    setSpinDisabled(false);
  };

  useEffect(() => {
    getPrizes();
  }, [getPrizes]);

  return (
    <div
      className={clsx(
        'flex flex-col max-w-[2560px] w-full min-h-screen px-4 pt-[16px] pb-[112px]',
        styles['spin-container'],
      )}>
      <MobileBackNav theme="dark" className="mb-[32px]" />
      <BalanceModule balanceData={balanceData} />
      <div className="mt-[59px] w-full flex justify-center items-center flex-col">
        <div className="relative">
          <SpinArrow className="absolute -top-[12px] left-0 right-0 m-auto z-30" />
          <Image src={spinBg} className={clsx('w-[343px] h-[343px]')} alt="" />
          <div className="absolute top-[15px] left-[15px] z-20 w-[313px] h-[313px] bg-transparent border-[10px] border-solid rounded-full border-fillMask20"></div>
          <div className={clsx('absolute top-[15px] w-[313px] h-[313px] left-[15px] z-10')}>
            {spinPrizes.length ? (
              <LuckyWheel
                ref={myLucky}
                width="313px"
                height="313px"
                blocks={spinBlocks}
                prizes={spinPrizes}
                buttons={spinCenterButtons}
                defaultConfig={defaultConfig}
                onEnd={spinOnEnd}
              />
            ) : null}
          </div>
          <div className="relative -mt-[16px] flex justify-center items-center">
            <SpinRibbon className="w-[343px]" />
            <span className="absolute text-sm font-black text-black flex w-full h-full justify-center items-center mb-[10px]">
              Your Spin: {drawsCounts}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center flex-col">
        <TGButton type="success" size="large" className="mt-[32px]" onClick={onSpin} disabled={spinDisabled}>
          <span className="text-base font-black">spin</span>
        </TGButton>
        <span className="text-xs font-bold mt-[16px] text-pixelsWhiteBg">
          Each spin consumes {numberOfFishConsumedInDraw} $Fish
        </span>
      </div>
    </div>
  );
}
