import { Image, ImageProps } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as EyeSVG } from 'assets/img/icons/eye.svg';
import { ReactComponent as RadioSelect } from 'assets/img/icons/radio-select.svg';
import { ReactComponent as Radio } from 'assets/img/icons/radio.svg';
import useResponsive from 'hooks/useResponsive';
interface IAIImageProps {
  src: string;
  active: boolean;
  index: number;
  onSelect: (index: number) => void;
}

function AIImage({ src, active, index, onSelect }: IAIImageProps) {
  const { isLG } = useResponsive();
  const [show, setShow] = useState(false);

  const imageSize = useMemo(() => (isLG ? 103 : 108), [isLG]);
  const preview = useMemo<ImageProps['preview']>(() => {
    return isLG
      ? {
          visible: show,
          maskClassName: 'rounded-lg !opacity-0',
          onVisibleChange: () => setShow(false),
        }
      : {
          maskClassName: 'rounded-lg',
        };
  }, [isLG, show]);

  const onClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <div className="relative bg-[#F5FEF7] w-[103px]] h-[103px] lg:w-[108px] lg:h-[108px] rounded-lg">
      <div
        className="flex justify-center items-center absolute w-[32px] h-[32px] right-0 cursor-pointer z-10"
        onClick={onClick}>
        {active ? <RadioSelect /> : <Radio />}
      </div>
      <Image
        id="ai-image"
        className="object-contain rounded-lg"
        src={src}
        width={imageSize}
        height={imageSize}
        alt="AI-image"
        preview={preview}
      />
      {isLG && (
        <div
          className="absolute bottom-3 left-3 flex justify-center items-center rounded-md px-1 py-2 bg-fillMask1 w-[24px] h-[24px]"
          onClick={() => setShow(true)}>
          <EyeSVG />
        </div>
      )}
    </div>
  );
}

interface IAIImageSelectProps {
  list?: string[];
  onSelect: (index: number) => void;
}

export default function AIImageSelect({ list, onSelect }: IAIImageSelectProps) {
  const [current, setCurrent] = useState<number>(-1);

  const onClick = useCallback(
    (index: number) => {
      setCurrent(index);
      onSelect?.(index);
    },
    [onSelect],
  );

  useEffect(() => {
    if (list?.length === 1) {
      onClick(0);
    }
  }, [list, onClick]);

  return (
    <div className="flex gap-[16px] flex-wrap">
      {list?.map((src, index) => (
        <AIImage key={index} src={src} index={index} active={current === index} onSelect={onClick} />
      ))}
    </div>
  );
}
