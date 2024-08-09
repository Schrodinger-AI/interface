import { Input, IInputProps } from 'aelf-design';
import { ReactComponent as SearchIcon } from 'assets/img/search.svg';
import clsx from 'clsx';
import { TModalTheme } from 'components/CommonModal';
import styles from './index.module.css';

export default function CommonSearch(
  props: Omit<IInputProps, 'prefix'> & {
    theme?: TModalTheme;
  },
) {
  return (
    <Input
      className={clsx(
        props.theme === 'dark' &&
          '!bg-pixelsModalBg rounded-none !border-pixelsBorder !tg-card-shadow text-pixelsDivider',
        props.theme === 'dark' && styles['dark-input'],
      )}
      {...props}
      prefix={<SearchIcon />}
    />
  );
}
