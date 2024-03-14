import { Image, ImageProps } from 'antd';
import { Button } from 'aelf-design';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as EyeSVG } from 'assets/img/icons/eye.svg';
import { ReactComponent as RadioSelect } from 'assets/img/icons/radio-select.svg';
import DefaultCatImg from 'assets/img/icons/defaultCat.png';
import useResponsive from 'hooks/useResponsive';
import { formatImageSrc } from 'utils/format';
import clsx from 'clsx';

import styles from './style.module.css';

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
  const [random, setRandom] = useState<number>(0);

  const imageSrc = useMemo(() => formatImageSrc(src), [src]);
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

  const Radio = useMemo(() => {
    return (
      <div
        className={clsx(
          styles.radio,
          'bg-[var(--fill-mask-3)] shadow-selectShadow w-[28px] h-[28px] rounded-[28px] border-[2.5px] border-solid border-neutralWhiteBg hover:border-brandDefault',
          active && '!border-brandDefault !bg-brandDefault',
        )}>
        {active ? <RadioSelect /> : null}
      </div>
    );
  }, [active]);

  return (
    <div
      className={clsx(
        styles.radio,
        'relative border-solid bg-[#F5FEF7] flex-1 aspect-square lg:flex-none lg:w-[120px] lg:h-[120px] rounded-lg overflow-hidden',
        active ? 'border-[2px] border-brandDefault' : 'border border-neutralBorder',
      )}>
      <div
        className="flex justify-center items-center absolute w-[32px] h-[32px] right-[8px] top-[8px] cursor-pointer z-10"
        onClick={onClick}>
        {Radio}
      </div>
      <Image
        id="ai-image"
        className={clsx('w-full h-full')}
        // src={`${src}?${random}`}
        src={imageSrc}
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
    <div className="flex gap-[16px] flex-wrap bg-brandBg border border-solid border-brandEnable rounded-lg p-[16px]">
      {list?.map((src, index) => (
        <AIImage key={index} src={src} index={index} active={current === index} onSelect={onClick} />
      ))}
    </div>
  );
}
