import { IScrollAlertItem } from 'components/ScrollAlert';
import { TCustomizationItemType, TGlobalConfigType } from 'redux/types/reducerTypes';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { divDecimals } from 'utils/calculate';
import { formatTokenPrice } from 'utils/format';
import { openExternalLink } from 'utils/openlink';

const onJump = (symbol: string, cmsInfo?: TCustomizationItemType & TGlobalConfigType) => {
  const forestUrl = cmsInfo?.forestUrl || '';

  openExternalLink(`${forestUrl}/detail/buy/${cmsInfo?.curChain}-${symbol}/${cmsInfo?.curChain}`, '_blank');
};

const mockData = [
  {
    symbol: 'SGR-7649',
    amount: 105309200,
    decimals: 8,
    dealTime: 1711957656365,
    price: 2200000000,
    fromAddress: 'rA2p1UHcjk5V9A4kfGWhpK3sjXywYEyfcb5aYjpHmYUFENHXF',
  },
  {
    symbol: 'SGR-7650',
    amount: 105309200,
    decimals: 8,
    dealTime: 1711957656365,
    price: 23400000000,
    fromAddress: 'rA2p1UHcjk5V9A4kfGWhpK3sjXywYEyfcb5aYjpHmYUFENHXF',
  },
  {
    symbol: 'SGR-7651',
    amount: 105309200,
    decimals: 8,
    dealTime: 1711957656365,
    price: 63400000000,
    fromAddress: 'rA2p1UHcjk5V9A4kfGWhpK3sjXywYEyfcb5aYjpHmYUFENHXF',
  },
  {
    symbol: 'SGR-7652',
    amount: 105309200,
    decimals: 8,
    dealTime: 1711957656365,
    price: 600000000,
    fromAddress: 'rA2p1UHcjk5V9A4kfGWhpK3sjXywYEyfcb5aYjpHmYUFENHXF',
  },
];

export const getNoticeData: (cmsInfo?: TCustomizationItemType & TGlobalConfigType) => IScrollAlertItem[] = (
  cmsInfo?: TCustomizationItemType & TGlobalConfigType,
) => {
  try {
    return mockData.map((item) => {
      return {
        text: (
          <span>
            {item.symbol} purchased for{' '}
            <span className="text-warning600">{formatTokenPrice(divDecimals(item.price, item.decimals))} ELF</span> by{' '}
            {getOmittedStr(addPrefixSuffix(item.fromAddress), OmittedType.ADDRESS)}
          </span>
        ),
        handle: () => onJump(item.symbol, cmsInfo),
      };
    });
  } catch (error) {
    return [];
  }
};
