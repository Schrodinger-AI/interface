import { HashAddress } from 'aelf-design';
import TextArea from 'antd/es/input/TextArea';
import SkeletonImage from 'components/SkeletonImage';
import React, { useCallback, useMemo, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
import { TSGRItem } from 'types/tokens';
import { formatTimeByDayjs, formatTokenPrice } from 'utils/format';
import { useCmsInfo } from 'redux/hooks';
import { divDecimals } from 'utils/calculate';
import styles from './style.module.css';

export enum CardType {
  MY = 'my',
  LATEST = 'latest',
}
interface IItemCard {
  item: TSGRItem;
  onPress: (item: TSGRItem) => void;
  type: CardType;
}

export default function ItemCard({ item, onPress, type }: IItemCard) {
  const {
    inscriptionImage,
    inscriptionImageUri,
    generation = '1',
    tokenName,
    amount,
    decimals,
    adoptTime,
    adopter,
    inscriptionDeploy,
  } = item || {};

  const transformedAmount = useMemo(() => formatTokenPrice(amount, { decimalPlaces: decimals }), [amount, decimals]);

  const cmsInfo = useCmsInfo();

  const containsInscriptionCode = useMemo(() => {
    if (inscriptionDeploy === '{}') return false;
    try {
      JSON.parse(inscriptionDeploy);
      return true;
      // eslint-disable-next-line no-empty
    } catch (ignored) {}
    return false;
  }, [inscriptionDeploy]);

  const onCardClick = useCallback(() => {
    onPress && onPress(item);
  }, [item, onPress]);

  const adoptTimeStr = useMemo(() => formatTimeByDayjs(item.adoptTime), [item.adoptTime]);

  return (
    <div
      className="w-full overflow-hidden border border-neutralBorder border-solid rounded-md cursor-pointer"
      onClick={onCardClick}>
      <div>
        <div className={styles['item-card-img-wrap']}>
          <div className="bg-black bg-opacity-60 px-1 flex flex-row justify-center items-center absolute top-2 left-2 rounded-sm z-10">
            <div className="text-white text-xss leading-4 font-poppins">{`GEN ${generation}`}</div>
          </div>
          <SkeletonImage
            img={inscriptionImageUri || inscriptionImage}
            imageSizeType="contain"
            className="w-full h-auto aspect-square object-contain"
          />
          {containsInscriptionCode && (
            <div
              className={`bg-black bg-opacity-60 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-20 invisible ${styles['inscription-info-wrap']}`}>
              <CodeBlock value={inscriptionDeploy} decimals={decimals} />
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
              <div className="text-xs leading-[18px] text-neutralDisable">{adoptTimeStr || '--'}</div>
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

export function CodeBlock({ value, decimals = 8 }: { value: string; decimals?: number }) {
  const list: string[] = useMemo(() => {
    try {
      const parsed = JSON.parse(value);
      const _list: string[] = [];
      Object.keys(parsed).map((item) => {
        let value = parsed[item];
        if (item === 'lim' || item === 'max') {
          value = divDecimals(value, decimals);
        }
        _list.push(`    "${item}": "${value}"`);
      });
      return _list;
    } catch (error) {
      console.log('error', error);
    }
    return [];
  }, [decimals, value]);

  return (
    <div className="flex flex-col ml-[8px]">
      <span className="text-white text-xs main:text-sm">{`{`}</span>
      {list.map((item, index) => (
        <span className="text-white text-xs main:text-sm whitespace-pre" key={index}>
          {item}
        </span>
      ))}
      <span className="text-white text-xs main:text-sm">{`}`}</span>
    </div>
  );
}
