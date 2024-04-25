'use client';
import { IScrollAlertItem } from 'components/ScrollAlert';
import { TNftActivityListByConditionData } from 'graphqlServer';
import { useNftActivityListByCondition } from 'graphqlServer/hooks';
import { useCallback } from 'react';
import { useCmsInfo } from 'redux/hooks';
import { TCustomizationItemType, TGlobalConfigType } from 'redux/types/reducerTypes';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { formatTokenPrice } from 'utils/format';
import { openExternalLink } from 'utils/openlink';

export default function useGetNoticeData() {
  const cmsInfo = useCmsInfo();

  const getNftActivityListByCondition = useNftActivityListByCondition();

  const onJump = (nftId: string, cmsInfo?: TCustomizationItemType & TGlobalConfigType) => {
    const forestUrl = cmsInfo?.forestUrl || '';

    openExternalLink(`${forestUrl}/detail/buy/${nftId}/${cmsInfo?.curChain}`, '_blank');
  };

  const getNoticeData: () => Promise<IScrollAlertItem[]> = useCallback(async () => {
    const { nftActivityListFilter } = cmsInfo || {};
    const timestampMax = nftActivityListFilter?.timestampMax || new Date().getTime();
    try {
      const { data } = await getNftActivityListByCondition({
        input: {
          skipCount: 0,
          maxResultCount: nftActivityListFilter?.maxResultCount || 5,
          sortType: nftActivityListFilter?.sortType || 'DESC',
          abovePrice: nftActivityListFilter?.abovePrice || 20,
          filterSymbol: nftActivityListFilter?.filterSymbol || 'SGR',
          timestampMin: nftActivityListFilter?.timestampMin || 1710892800000,
          timestampMax,
          types: nftActivityListFilter?.types || [3],
        },
      });

      return data?.nftActivityListByCondition.data?.map((item: TNftActivityListByConditionData) => {
        const symbol = item?.nftInfoId?.replace(`${cmsInfo?.curChain}-`, '');
        return {
          text: (
            <span>
              {symbol} purchased for <span className="text-warning600">{formatTokenPrice(item.price)} ELF</span> by{' '}
              {getOmittedStr(addPrefixSuffix(item.from), OmittedType.ADDRESS)}
            </span>
          ),
          handle: () => onJump(item.nftInfoId, cmsInfo),
        };
      });
    } catch (error) {
      return [];
    }
  }, [cmsInfo, getNftActivityListByCondition]);

  return {
    getNoticeData,
  };
}
