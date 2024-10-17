import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import { TokenEarnList } from 'components/EarnList';

export default function TokenEarnCard({
  pointDetails,
  hasBoundAddress,
  boundEvmAddress,
  tokenEarnListClassName,
  theme = 'light',
  bindAddress,
}: {
  pointDetails: IPointItem[];
  hasBoundAddress?: boolean;
  boundEvmAddress?: string;
  theme?: TModalTheme;
  tokenEarnListClassName?: string;
  bindAddress?: () => Promise<void>;
}) {
  return (
    <div>
      {pointDetails.length ? (
        <TokenEarnList
          dataSource={pointDetails || []}
          hasBoundAddress={hasBoundAddress}
          boundEvmAddress={boundEvmAddress}
          theme={theme}
          className={tokenEarnListClassName}
          bindAddress={bindAddress}
        />
      ) : (
        <p
          className={clsx(
            'pt-[24px] pb-[8px] text-lg text-center',
            theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary',
          )}>
          No flux points yet.
        </p>
      )}
    </div>
  );
}
