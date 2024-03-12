import { Image, ImageProps } from 'antd';
import { Button } from 'aelf-design';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as EyeSVG } from 'assets/img/icons/eye.svg';
import { ReactComponent as RadioSelect } from 'assets/img/icons/radio-select.svg';
import { ReactComponent as Radio } from 'assets/img/icons/radio.svg';
import DefaultCatImg from 'assets/img/icons/defaultCat.png';
import useResponsive from 'hooks/useResponsive';
import clsx from 'clsx';
interface IAIImageProps {
  src: string;
  active: boolean;
  index: number;
  onSelect: (index: number) => void;
}

function AIImage({ src, active, index, onSelect }: IAIImageProps) {
  const { isLG } = useResponsive();
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [random, setRandom] = useState<number>();

  const imageSize = useMemo(() => (isLG ? 103 : 108), [isLG]);
  const preview = useMemo<ImageProps['preview']>(() => {
    return isLG
      ? {
          visible: show,
          maskClassName: 'rounded-lg !opacity-0',
          onVisibleChange: () => setShow(false),
        }
      : {
          visible: error ? false : undefined,
          maskClassName: clsx('rounded-lg', error && '!opacity-0'),
        };
  }, [error, isLG, show]);

  const onClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  const onError = useCallback(() => {
    console.log('image-load-error');
    setError(true);
    setShow(false);
  }, [setError, setShow]);

  const onReload = useCallback(() => {
    setError(false);
    setRandom(Date.now());
  }, []);

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
        src={`${src}?${random}`}
        width={imageSize}
        height={imageSize}
        alt="AI-image"
        preview={preview}
        onError={onError}
        fallback={DefaultCatImg.src}
      />
      {isLG && !error && (
        <div
          className="absolute bottom-3 left-3 flex justify-center items-center rounded-md px-1 py-2 bg-fillMask1 w-[24px] h-[24px]"
          onClick={() => setShow(true)}>
          <EyeSVG />
        </div>
      )}
      {/* {error && (
        <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-fillMask1 rounded-lg">
          <Button type="primary" size="small" onClick={onReload}>
            Reload
          </Button>
        </div>
      )} */}
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
