import { HashAddress } from 'aelf-design';
import TextArea from 'antd/es/input/TextArea';
import SkeletonImage from 'components/SkeletonImage';
import React, { useMemo, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
import { TSGRItem } from 'types/tokens';
import { formatTimeByDayjs, formatTokenPrice } from 'utils/format';
import { useCmsInfo } from 'redux/hooks';

export enum CardType {
  MY = 'my',
  LATEST = 'latest',
}
interface IItemCard {
  item: TSGRItem;
  onPress: () => void;
  type: CardType;
}

export default function ItemCard({ item, onPress, type }: IItemCard) {
  const {
    inscriptionImage,
    generation = '1',
    tokenName,
    symbol,
    amount,
    decimals,
    adoptTime,
    adopter,
    inscriptionDeploy,
  } = item || {};
  const transformedAmount = useMemo(() => formatTokenPrice(amount, { decimalPlaces: decimals }), [amount, decimals]);

  const cmsInfo = useCmsInfo();

  const containsInscriptionCode = useMemo(() => {
    let _containsInscriptionCode = false;
    try {
      JSON.parse(inscriptionDeploy);
      _containsInscriptionCode = true;
      // eslint-disable-next-line no-empty
    } catch (ignored) {}
    return _containsInscriptionCode;
  }, [inscriptionDeploy]);

  return (
    <div className="w-full overflow-hidden border border-neutralBorder border-solid rounded-md" onClick={onPress}>
      <div>
        <div className="relative">
          <div className="bg-black bg-opacity-60 px-1 flex flex-row justify-center items-center absolute top-2 left-2 rounded-sm">
            <div className="text-white text-xss leading-4 font-poppins">{`GEN ${generation}`}</div>
          </div>
          <SkeletonImage
            img={inscriptionImage}
            imageSizeType="contain"
            className="w-full h-auto aspect-square object-contain"
          />
          {containsInscriptionCode && (
            <div className="bg-black bg-opacity-75 absolute top-0 bottom-0 left-0 right-0 rounded-xl flex justify-center">
              <div className="flex w-full justify-center items-center text-white text-base font-medium break-all pl-20 pcMin:pl-0">
                <CodeBlock className="!bg-transparent cursor-pointer w-full" value={inscriptionDeploy} />
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-4 flex flex-col">
          <div className="flex  flex-col text-lg leading-6 font-medium max-w-xs whitespace-nowrap">
            <span className="text-sm text-neutralPrimary font-medium text-ellipsis overflow-hidden line-clamp-1">
              {tokenName || '--'}
            </span>
          </div>
          {type === CardType.LATEST && (
            <div className="flex flex-col pt-1">
              <div className="text-xs leading-[18px] text-neutralDisable">{adoptTime || '--'}</div>
              <div className="flex justify-between flex-col main:flex-row">
                <HashAddress size="small" preLen={8} endLen={9} address={adopter} chain={cmsInfo?.curChain} hasCopy />
                <div className="flex flex-row items-center">
                  <XIcon />
                  <div className="ml-1 text-sm leading-5 text-gray-400">{transformedAmount}</div>
                </div>
              </div>
            </div>
          )}
          {type === CardType.MY && (
            <div className="flex flex-row items-center pt-1">
              <XIcon />
              <div className="ml-1 text-sm leading-5 text-gray-400">{transformedAmount}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CodeBlock({
  value,
  className,
  rows = 8,
  ...params
}: {
  value: string;
  className?: string;
  rows?: number;
}) {
  const jsonFormatted = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(value), null, 4);
    } catch (e) {
      return '';
    }
  }, [value]);

  return (
    <TextArea
      rows={rows}
      value={jsonFormatted}
      className={`tx-block-code-like-content h-[200px] resize-none ${className}`}
      readOnly
      {...params}
    />
  );
}
