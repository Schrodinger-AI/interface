import { catPool, catPoolRank } from 'api/request';
import Rewards from 'pageComponents/tg-breed/components/Rewards';
import React, { useCallback, useEffect, useState } from 'react';
import { divDecimals } from 'utils/calculate';
import { formatTokenPrice } from 'utils/format';
import { useRequest } from 'ahooks';
import { TModalTheme } from 'components/CommonModal';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

function RewardsCard({ theme = 'light' }: { theme?: TModalTheme }) {
  const { isConnected } = useConnectWallet();
  const [isOver, setIsOver] = useState<boolean>(false);
  const [prizePoolInfo, setPrizePoolInfo] = useState<ICatPoolRes>();

  const getCatPool = async () => {
    if (isOver || !isConnected) return;
    const res = await catPool();
    const prize = formatTokenPrice(divDecimals(res.prize, 8));
    const usdtValue = formatTokenPrice(divDecimals(res.usdtValue, 8));
    setPrizePoolInfo({ ...res, prize, usdtValue });
  };

  useRequest(() => getCatPool(), {
    pollingInterval: 5000,
    refreshDeps: [isConnected, isOver],
  });

  const getCatPoolRank = useCallback(async () => {
    const res = await catPoolRank();
    setIsOver(res.isOver);
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    getCatPoolRank();
  }, [getCatPoolRank, isConnected]);

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
