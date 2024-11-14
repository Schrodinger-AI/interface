/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import MobileBackNav from 'components/MobileBackNav';
import Rewards from './components/Rewards';
import BreedModule from './components/BreedModule';
import Rank from './components/Rank';
import RewardResult from './components/RewardResult';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useTelegram from 'hooks/useTelegram';
import { catPool, catPoolRank } from 'api/request';
import { useRequest } from 'ahooks';
import { divDecimals } from 'utils/calculate';
import { formatTokenPrice } from 'utils/format';

function TgBreed() {
  const { isInTG } = useTelegram();
  const { isLogin } = useGetLoginStatus();
  const router = useRouter();

  const [prizePoolInfo, setPrizePoolInfo] = useState<ICatPoolRes>();
  const [isOver, setIsOver] = useState<boolean>(false);
  const [rankList, setRankList] = useState<ICatPoolRankRes['rankList']>([]);
  const [winnerInfo, setWinnerInfo] = useState<IWinnerInfo>();

  const theme = useMemo(() => {
    if (isInTG) {
      return 'dark';
    }
    return 'light';
  }, [isInTG]);

  const getCatPoolRank = useCallback(async () => {
    const res = await catPoolRank();
    setIsOver(res.isOver);
    setRankList(res.rankList);
    setWinnerInfo({
      winnerAddress: res.winnerAddress,
      winnerDescribe: res.winnerDescribe,
      winnerImage: res.winnerImage,
      winnerSymbol: res.winnerSymbol,
    });
  }, []);

  const getCatPool = async () => {
    if (!isLogin || isOver) return;
    const res = await catPool();
    const prize = formatTokenPrice(divDecimals(res.prize, 8));
    const usdtValue = formatTokenPrice(divDecimals(res.usdtValue, 8));
    setPrizePoolInfo({ ...res, prize, usdtValue });
  };

  useRequest(() => getCatPool(), {
    pollingInterval: 5000,
    refreshDeps: [isLogin, isOver],
  });

  useEffect(() => {
    if (!isLogin) {
      router.replace(isInTG ? '/telegram/home' : '/');
    }
  }, [isInTG, isLogin, router]);

  useEffect(() => {
    if (!isLogin) return;
    getCatPoolRank();
  }, [getCatPoolRank, isLogin]);

  return (
    <div className={clsx('w-full h-full py-[16px]')}>
      <div className="px-[16px]">
        <MobileBackNav theme={theme} />
      </div>
      <Rewards
        countdown={prizePoolInfo?.countdown}
        sgrAmount={prizePoolInfo?.prize}
        usdtAmount={prizePoolInfo?.usdtValue}
        theme={theme}
        isOver={isOver}
        onFinish={getCatPoolRank}
      />
      {isOver ? <RewardResult winnerInfo={winnerInfo} /> : <BreedModule theme={theme} updateRank={getCatPoolRank} />}
      {isOver || !rankList?.length ? null : <Rank rankList={rankList} theme={theme} />}
    </div>
  );
}

export default TgBreed;
