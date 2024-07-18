import { Flex } from 'antd';
import { useCallback } from 'react';
import { ReactComponent as TipSVG } from 'assets/img/telegram/tip-icon.svg';
import BalanceItem from '../BalanceItem';
import useBalanceService from 'pageComponents/tg-home/hooks/useBalanceService';
import CommonCopy from 'components/CommonCopy';

export default function BalanceModule() {
  const { formatAddress, balanceData, fullAddress } = useBalanceService();

  const handleRules = useCallback(() => {
    //TODO:
  }, []);

  return (
    <>
      <Flex justify="space-between" align="center" className="text-neutralWhiteBg text-sm font-normal">
        <span className="font-medium">Balance:</span>
        {/* <Flex gap={8} align="center" onClick={handleRules} className="cursor-pointer w-fit">
          Rule
          <TipSVG className="w-[14px] h-[14px]" />
        </Flex> */}
      </Flex>
      <Flex gap={16} className="mt-2" wrap="wrap">
        {balanceData.map((item, index) => {
          return <BalanceItem key={index} {...item} />;
        })}
      </Flex>
      <Flex className="text-sm font-medium text-neutralWhiteBg mt-4" align="center">
        <span>Address:</span>
        <CommonCopy toCopy={fullAddress} className="text-pixelsTertiaryTextPurple ml-4" size="large">
          {formatAddress}
        </CommonCopy>
      </Flex>
    </>
  );
}
