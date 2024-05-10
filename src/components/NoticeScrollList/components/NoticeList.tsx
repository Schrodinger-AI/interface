import SkeletonImage from 'components/SkeletonImage';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
import { useCmsInfo } from 'redux/hooks';
import { openExternalLink } from 'utils/openlink';
import HonourLabel from 'components/ItemCard/components/HonourLabel';
import { formatTokenPrice } from 'utils/format';
import clsx from 'clsx';
import moment from 'moment';

export enum TransactionType {
  'SOLD',
  'BOUGHT',
  'OFFER',
}

const transactionPrice: Record<
  string,
  {
    prefix: string;
    className: string;
  }
> = {
  SOLD: {
    prefix: '+',
    className: 'text-functionalSuccess',
  },
  BOUGHT: {
    prefix: '-',
    className: 'text-functionalError',
  },
  OFFER: {
    prefix: '',
    className: 'text-brandDefault',
  },
};

function NoticeList({
  nftInfoId,
  tokenName,
  previewImage,
  price,
  amount,
  type,
  rank,
  awakenPrice,
  createtime,
  generation,
  level,
  describe,
  isUnread = false,
}: ITransactionMessageListItem & {
  isUnread: boolean;
}) {
  const cmsInfo = useCmsInfo();

  const jumpToForest = useCallback(() => {
    const forestUrl = cmsInfo?.forestUrl || '';
    if (!forestUrl) return;
    openExternalLink(`${forestUrl}/detail/buy/${cmsInfo?.curChain}-${nftInfoId}/${cmsInfo?.curChain}`, '_blank');
  }, [cmsInfo?.curChain, cmsInfo?.forestUrl, nftInfoId]);

  const renderTag = (value: string) => {
    return (
      <span className="h-[24px] px-[8px] mt-[8px] flex justify-center items-center bg-neutralDefaultBg rounded-[4px] text-[10px] leading-[18px] font-medium text-neutralPrimary ml-[8px] first:ml-0">
        {value}
      </span>
    );
  };

  const formatTime = useMemo(() => {
    console.log('=====createtime', createtime);
    return moment(createtime).format('YYYY/MM/DD HH:mm:ss');
  }, [createtime]);

  useEffect(() => {
    const res1 = TransactionType[type || 0];
    const res = transactionPrice[TransactionType[type || 0]];
    console.log('=====type', res, res1);
  }, [type]);

  return (
    <div
      className="w-full flex py-[16px] px-0 lg:px-[24px] lg:py-[24px] items-start cursor-pointer hover:bg-neutralHoverBg"
      onClick={jumpToForest}>
      <div className="w-[96px] h-[96px] mr-[16px]">
        <SkeletonImage
          badge={{
            visible: isUnread,
          }}
          img={previewImage}
          imageSizeType="contain"
          className="w-full h-auto aspect-square object-contain overflow-visible"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="w-full truncate text-base text-neutralTitle font-medium">
          {`[${TransactionType[type || 0]}]`}
          {tokenName}
        </div>
        <div className="flex items-center flex-wrap">
          {renderTag(`GEN ${generation}`)}
          {level ? renderTag(`Lv. ${level}`) : null}
          {rank ? renderTag(`Rank ${formatTokenPrice(rank)}`) : null}
          {describe ? <HonourLabel text={describe} className="bg-white" /> : null}
        </div>
        <div className="mt-[4px]">
          <span className="text-xs text-neutralSecondary">{formatTime}</span>
        </div>
        <div className="flex items-center mt-[9px] justify-between">
          <div className="flex items-center">
            <XIcon className="fill-neutralDisable mr-[4px]" />
            <div className="text-xs text-neutralPrimary">{formatTokenPrice(amount)}</div>
          </div>
          <div className="flex items-center">
            {awakenPrice ? (
              <span className="text-sm font-medium text-neutralSecondary mr-[8px]">(RSP {awakenPrice} ELF)</span>
            ) : null}
            <span className={clsx('text-sm font-medium', transactionPrice[TransactionType[type || 0]]?.className)}>
              {transactionPrice[TransactionType[type || 0]]?.prefix} {price} ELF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(NoticeList);
