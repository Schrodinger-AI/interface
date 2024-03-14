import { HashAddress } from 'aelf-design';
import TextArea from 'antd/es/input/TextArea';
import SkeletonImage from 'components/SkeletonImage';
import React, { useMemo, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
import { TBaseSGRToken } from 'types/tokens';
import { formatTimeByDayjs } from 'utils/format';
import { useCmsInfo } from 'redux/hooks';

export enum CardType {
  MY = 'my',
  LATEST = 'latest',
}
interface IItemCard {
  item: TBaseSGRToken;
  onPress: () => void;
  type: CardType;
}

export default function ItemCard(props: IItemCard) {
  const {
    inscriptionImage,
    inscriptionInfo = '',
    generation = '1',
    tokenName,
    amount,
    blockTime,
    address = '--',
  } = props.item || {};
  const { type, onPress } = props;
  const transformedAmount = BigNumber(amount).toFormat(0);
  const blockTimeStr = useMemo(() => formatTimeByDayjs(blockTime), [blockTime]);
  const [hasInscriptionCode, setHasInscriptionCode] = useState<boolean>(false);
  const cmsInfo = useCmsInfo();

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
          {hasInscriptionCode && (
            <div className="bg-black bg-opacity-75 absolute top-0 bottom-0 left-0 right-0 rounded-xl flex justify-center">
              <div className="flex w-full justify-center items-center text-white text-base font-medium break-all pl-20 pcMin:pl-0">
                <CodeBlock className="!bg-transparent cursor-pointer w-full" value={inscriptionInfo} />
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
              <div className="text-xs leading-[18px] text-neutralDisable">{blockTimeStr || '--'}</div>
              <div className="flex justify-between flex-col main:flex-row">
                <HashAddress size="small" preLen={8} endLen={9} address={address} chain={cmsInfo?.curChain} hasCopy />
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
