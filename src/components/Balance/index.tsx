import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';

export default function Balance(props: {
  itemDesc?: string;
  className?: string;
  theme?: TModalTheme;
  items?: {
    amount: string;
    suffix?: string;
    usd?: string;
  }[];
}) {
  const { itemDesc, items, className, theme = 'light' } = props;
  return (
    <div
      className={clsx(
        'flex justify-between p-[16px]',
        theme === 'dark' ? 'rounded-none bg-pixelsPageBg' : 'rounded-lg bg-neutralHoverBg',
        className,
      )}>
      <span className={clsx('text-lg font-medium', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary')}>
        {itemDesc || 'Balance'}
      </span>
      <div>
        {items?.map((item, index) => {
          return (
            <span key={index} className="flex flex-col items-end justify-center mb-[8px]">
              <span
                className={clsx(
                  'text-base font-medium',
                  theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralPrimary',
                )}>{`${item.amount} ${item?.suffix ? ` ${item.suffix}` : ''}`}</span>
              {item.usd && (
                <span
                  className={clsx(
                    'text-base',
                    theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary',
                  )}>{`$ ${item.usd}`}</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
