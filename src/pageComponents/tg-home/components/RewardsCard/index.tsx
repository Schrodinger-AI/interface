import { catPool } from 'api/request';
import Rewards from 'pageComponents/tg-breed/components/Rewards';
import React, { useState } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { divDecimals } from 'utils/calculate';
import { formatTokenPrice } from 'utils/format';
import { useRequest } from 'ahooks';
import { TModalTheme } from 'components/CommonModal';

function RewardsCard({ theme = 'light' }: { theme?: TModalTheme }) {
  const { isLogin } = useGetLoginStatus();
  const [isOver, setIsOver] = useState<boolean>(false);
  const [prizePoolInfo, setPrizePoolInfo] = useState<ICatPoolRes>();

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

  return (
    <Rewards
      countdown={prizePoolInfo?.countdown}
      sgrAmount={prizePoolInfo?.prize}
      usdtAmount={prizePoolInfo?.usdtValue}
      theme={theme}
      isOver={isOver}
      className="!px-0"
      hideTitle={true}
      onFinish={() => setIsOver(true)}
    />
  );
}

export default React.memo(RewardsCard);
