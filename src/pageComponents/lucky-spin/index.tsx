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
import { useCmsInfo } from 'redux/hooks';
import { sleep } from '@portkey/utils';
import BigNumber from 'bignumber.js';
import MobileBackNav from 'components/MobileBackNav';
import { numberOfFishConsumedInDraw } from 'constants/common';
import { useModal } from '@ebay/nice-modal-react';
import NoticeModal from './components/NoticeModal';
import SpinResultModal from './components/SpinResultModal';
import { IContractError, ISpinInfo, ISpunLogs, SpinRewardType } from 'types';
import { formatNumber } from 'utils/format';

export default function Spinner() {
  const { balanceData, fish, updatePoints } = useBalanceService();
  const { showLoading, closeLoading } = useLoading();
  const cmsInfo = useCmsInfo();
  const [spinInfo, setSpinInfo] = useState<
    ISpinInfo & {
      tick: string;
    }
  >();
  const noticeModal = useModal(NoticeModal);
  const spinResultModal = useModal(SpinResultModal);
  const [spinDisabled, setSpinDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [spinPrizes, setSpinPrizes] = useState<ILuckyWheelPrizes[]>([]);

  const drawsCounts = useMemo(() => {
    return BigNumber(fish).dividedToIntegerBy(numberOfFishConsumedInDraw).toNumber();
  }, [fish]);

  const getSpinInfo = useCallback(
    async (params: ISpin) => {
      const contractAddress = cmsInfo?.schrodingerSideAddress;
      if (!contractAddress) return;
      const currentFish = BigNumber(fish).minus(100).toNumber();
      console.log('=====spin updatePoints -100', fish, currentFish);
      updatePoints(currentFish);
      const result = await Spin(params);
      const TransactionResult = result.TransactionResult;
      const logs = await ProtoInstance.getLogEventResult<ISpunLogs>({
        contractAddress,
        logsName: 'Spun',
        TransactionResult,
      });
      console.log('=====spin Spin logs', logs);
      if (!logs) return;
      return { ...logs };
    },
    [cmsInfo?.schrodingerSideAddress, fish, updatePoints],
  );

  const getPrizesIndex = useCallback(
    (name: string) => {
      const index = spinPrizes.findIndex((item) => item.name === name);
      return index;
    },
    [spinPrizes],
  );

  const onSpin = useCallback(async () => {
    try {
      if (drawsCounts <= 0) {
        noticeModal.show();
        return;
      }
      if (!myLucky.current) return;
      myLucky.current.play();
      setSpinDisabled(true);
      const res = await toSpin();
      if (res.signature) {
        const info = await getSpinInfo(res);
        if (info) {
          const index = getPrizesIndex(info.spinInfo.name);
          myLucky.current.stop(index);
          setSpinInfo({ ...info.spinInfo, tick: info.tick });
        } else {
          myLucky.current.stop(0);
        }
      }
    } catch (error) {
      if (!myLucky.current) return;
      myLucky.current.stop(0);
      const resError = error as IContractError;
      setErrorMessage(resError.errorMessage?.message);
    }
  }, [drawsCounts, getPrizesIndex, getSpinInfo, noticeModal]);

  const showResultModal = useCallback(
    async (
      spinInfo: ISpinInfo & {
        tick: string;
      },
    ) => {
      await sleep(300);
      spinResultModal.show({
        type: spinInfo.type,
        amount: spinInfo.amount,
        tick: spinInfo.tick,
        onSpin,
      });
      setSpinInfo(undefined);
    },
    [onSpin, spinResultModal],
  );

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

  const spinOnEnd = useCallback(() => {
    if (spinInfo) {
      showResultModal(spinInfo);
      if (spinInfo.type === SpinRewardType.Point) {
        const currentFish = BigNumber(fish).plus(spinInfo.amount).toNumber();
        console.log('=====spin updatePoints +point', fish, currentFish, spinInfo.amount);

        updatePoints(currentFish);
      }
    } else {
      message.error(errorMessage || 'Failure! Please try again.');
    }

    setSpinDisabled(false);
  }, [fish, showResultModal, spinInfo, errorMessage, updatePoints]);

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
              Your Spin: {formatNumber(drawsCounts)}
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
