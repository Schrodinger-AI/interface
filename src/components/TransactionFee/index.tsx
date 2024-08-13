import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';

interface IProps {
  // TODO: number precision
  txFee?: string;
  usd?: string;
  theme?: TModalTheme;
}

export default function TransactionFee({ txFee, usd, theme }: IProps) {
  return (
    <div className="text-base">
      <div className="flex justify-between">
        <span className={theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary'}>Transaction Fee</span>
        <span className={clsx('font-medium', theme === 'dark' ? 'text-pixelsWhiteBg' : 'text-neutralTitle')}>
          {txFee ?? '--'} ELF
        </span>
      </div>
      <div className="flex justify-end">
        <span className={theme === 'dark' ? 'text-pixelsDivider' : 'text-neutralSecondary'}>$ {usd ?? '--'}</span>
      </div>
    </div>
  );
}
