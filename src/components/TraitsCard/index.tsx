/* eslint-disable @next/next/no-img-element */
import { Col } from 'antd';
import clsx from 'clsx';
import TextEllipsis from 'components/TextEllipsis';
import useResponsive from 'hooks/useResponsive';
import React, { useMemo } from 'react';
import { formatPercent } from 'utils/format';
import Image from 'next/image';
import { ITrait } from 'types/tokens';
import NewIcon from 'components/NewIcon';
import { TModalTheme } from 'components/CommonModal';

const scarceWidth = 20;

function TraitsCard({
  item,
  showNew = false,
  theme = 'light',
  className,
}: {
  item: ITrait;
  showNew?: boolean;
  theme?: TModalTheme;
  className?: string;
}) {
  const { isLG } = useResponsive();

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const cardBg = useMemo(() => {
    if (isDark) {
      if (item.isRare) {
        return 'bg-[#34240C]';
      } else {
        return 'bg-pixelsPageBg';
      }
    } else {
      if (item.isRare) {
        return 'bg-[#FFF5E6]';
      } else {
        return 'bg-neutralHoverBg';
      }
    }
  }, [isDark, item.isRare]);

  const traitTypeColor = useMemo(() => {
    if (isDark) {
      if (item.isRare) {
        return 'text-[#D2965E]';
      } else {
        return 'text-pixelsDivider';
      }
    } else {
      return 'text-neutralSecondary';
    }
  }, [isDark, item.isRare]);

  const traitValueColor = useMemo(() => {
    if (isDark) {
      if (item.isRare) {
        return 'text-[#D2965E]';
      } else {
        return 'text-pixelsWhiteBg';
      }
    } else {
      return 'text-neutralTitle';
    }
  }, [isDark, item.isRare]);

  const percentColor = useMemo(() => {
    if (isDark) {
      if (item.isRare) {
        return 'text-[#D2965E]';
      } else {
        return 'text-pixelsDivider';
      }
    } else {
      return 'text-neutralSecondary';
    }
  }, [isDark, item.isRare]);

  return (
    <Col span={isLG ? 24 : 8} key={item.traitType} className="px-[8px]">
      <div
        className={clsx(
          'flex flex-row lg:flex-col justify-center items-end lg:items-center overflow-hidden cursor-default py-[16px] lg:py-[24px] !px-[24px]',
          !showNew && !isLG && 'px-[8px]',
          cardBg,
          isDark ? `rounded-none` : `rounded-lg`,
          className,
        )}>
        <div key={item.traitType} className="flex-1 lg:flex-none lg:w-full overflow-hidden mr-[16px] lg:mr-0">
          <TextEllipsis
            value={item.traitType}
            className={clsx('text-left lg:text-center font-medium text-sm', traitTypeColor)}
          />
          <div className="flex justify-start lg:justify-center mt-[8px] items-center overflow-hidden">
            <div
              className="w-auto"
              style={{
                maxWidth: item.isRare ? `calc(100% - ${scarceWidth + 8}px)` : '100%',
              }}>
              <TextEllipsis
                value={item.value}
                className={clsx('w-full text-left lg:text-center font-medium text-xl', traitValueColor)}
              />
            </div>

            {item.isRare ? (
              <Image
                src={require('assets/img/icons/scarce.svg').default}
                width={scarceWidth}
                height={scarceWidth}
                alt="scarce"
                className="ml-[8px]"
              />
            ) : null}
          </div>
        </div>

        <div className={clsx('mt-[8px] flex justify-end lg:justify-center font-medium text-base', percentColor)}>
          {`${formatPercent(item.percent)}%`}
        </div>
        {showNew && <NewIcon className="absolute top-[-3px] right-0" />}
      </div>
    </Col>
  );
}

export default React.memo(TraitsCard);
