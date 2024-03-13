import TextArea from 'antd/es/input/TextArea';
import SkeletonImage from 'components/SkeletonImage';
import React, { useMemo } from 'react';
import { ReactComponent as XIcon } from 'assets/img/x.svg';
import { TBaseSGRToken } from 'types/tokens';
import { formatTokenPrice } from 'utils/format';

export default function ItemCard(props: { item: TBaseSGRToken; onPress: () => void }) {
  const {
    inscriptionImage,
    inscriptionInfo = '',
    generation = '1',
    tokenName,
    symbol,
    amount,
    decimals,
  } = props.item || {};
  const transformedAmount = useMemo(() => formatTokenPrice(amount, { decimalPlaces: decimals }), [amount, decimals]);

  const containsInscriptionCode = useMemo(() => {
    let _containsInscriptionCode = false;
    try {
      JSON.parse(inscriptionInfo);
      _containsInscriptionCode = true;
      // eslint-disable-next-line no-empty
    } catch (ignored) {}
    return _containsInscriptionCode;
  }, [inscriptionInfo]);

  return (
    <div className="w-full overflow-hidden border border-neutralBorder border-solid rounded-md" onClick={props.onPress}>
      <div>
        <div className="relative">
          <div className="bg-black bg-opacity-60 px-1 flex flex-row justify-center items-center absolute top-2 left-2 rounded-sm z-10">
            <div className="text-white text-xss leading-4 font-poppins">{`GEN ${generation}`}</div>
          </div>
          <SkeletonImage
            img={inscriptionImage}
            imageSizeType="contain"
            className="w-full h-auto aspect-square object-contain"
          />
          {!!containsInscriptionCode && (
            <div className="bg-black bg-opacity-75 absolute top-0 bottom-0 left-0 right-0 rounded-xl flex justify-center">
              <div className="flex w-full justify-center items-center text-white text-base font-medium break-all pl-20 pcMin:pl-0">
                <CodeBlock className="!bg-transparent cursor-pointer w-full" value={inscriptionInfo} />
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-4 flex flex-col">
          <div className="flex  flex-col text-lg leading-6 font-medium max-w-xs overflow-hidden whitespace-nowrap">
            <span className="text-xs leading-[18px] text-neutralDisable font-medium">name</span>
            <span className="text-sm text-neutralPrimary font-medium">{tokenName}</span>
          </div>
          <div className="flex flex-col pt-1">
            <span className="text-xs leading-[18px] text-neutralDisable font-medium">symbol</span>
            <span className="text-sm text-neutralPrimary font-medium">{symbol}</span>
          </div>
          <div className="flex flex-row items-center pt-1">
            <XIcon />
            <div className="ml-1 text-sm leading-5 text-gray-400">{transformedAmount}</div>
          </div>
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
  let jsonFormatted = value;
  try {
    jsonFormatted = JSON.stringify(JSON.parse(value), null, 4);
  } catch (e) {
    /* empty */
  }

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
