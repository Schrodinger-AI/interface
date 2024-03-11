import { Image } from 'antd';
import { ReactComponent as RadioSelect } from 'assets/img/icons/radio-select.svg';
import { ReactComponent as Radio } from 'assets/img/icons/radio.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useResponsive from 'hooks/useResponsive';

export type TAIImage = ISchrodingerImages['images'][0];

interface IAIImageSelectProps<T = any> {
  list: T[];
  onSelect: (item: T) => void;
}

interface IAIImageProps {
  src: string;
  active: boolean;
  onSelect: (item: any) => void;
  item?: any;
}

function AIImage({ src, active, item, onSelect }: IAIImageProps) {
  const { isLG } = useResponsive();

  const imageSize = useMemo(() => (isLG ? 103 : 108), [isLG]);

  const onClick = () => {
    onSelect(item);
  };

  return (
    <div className="relative bg-[#F5FEF7] w-[103px]] h-[103px] lg:w-[108px] lg:h-[108px] rounded-lg">
      <div className="absolute w-[32px] h-[32px] top-[6px] right-0 cursor-pointer z-10" onClick={onClick}>
        {active ? <RadioSelect /> : <Radio />}
      </div>
      <Image
        className="object-contain rounded-lg"
        src={src}
        width={imageSize}
        height={imageSize}
        alt="AI-image"
        preview={{ maskClassName: 'rounded-lg' }}
      />
    </div>
  );
}

export default function AIImageSelect({ list, onSelect }: IAIImageSelectProps<TAIImage>) {
  const [current, setCurrent] = useState<TAIImage>();

  const onClick = useCallback(
    (item: TAIImage) => {
      setCurrent(item);
      onSelect?.(item);
    },
    [onSelect],
  );

  useEffect(() => {
    if (list.length === 1) {
      onClick(list[0]);
    }
  }, [list, onClick]);

  return (
    <div className="flex gap-[16px] flex-wrap">
      {list.map((item, index) => (
        <AIImage key={index} src={item.image} item={item} active={current?.image === item.image} onSelect={onClick} />
      ))}
    </div>
  );
}
