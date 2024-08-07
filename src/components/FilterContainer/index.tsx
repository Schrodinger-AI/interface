import { useMemo } from 'react';
import { Drawer, Flex, Menu, MenuProps } from 'antd';
import { Button } from 'aelf-design';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import styles from './style.module.css';
import { TModalTheme } from 'components/CommonModal';
import clsx from 'clsx';

function CollapseForPC(
  props: Omit<MenuProps, 'theme'> & {
    theme?: TModalTheme;
  },
) {
  return (
    <Menu
      {...props}
      expandIcon={<ArrowSVG />}
      className={`${styles['items-side-menu']} ${props.theme === 'dark' && styles['items-side-menu-dark']}`}
      selectable={false}
      mode="inline"
    />
  );
}

interface IDropMenu extends MenuProps {
  showDropMenu: boolean;
  onCloseHandler: () => void;
  handleClearAll: () => void;
  handleApply: () => void;
  titleTxt?: string;
  wrapClassName?: string;
  theme?: TModalTheme;
}

const CollapseForPhone = ({
  showDropMenu,
  items,
  theme = 'light',
  onCloseHandler,
  handleClearAll,
  handleApply,
  titleTxt = 'Filter',
  ...params
}: IDropMenu) => {
  const isDark = useMemo(() => theme === 'dark', [theme]);

  const footer = useMemo(() => {
    return (
      <>
        <Flex className={styles['footer-wrapper']} gap={16}>
          <Button
            className={clsx(styles['footer-button'], isDark && '!primary-default-dark')}
            type="primary"
            ghost
            onClick={handleClearAll}>
            Clear All
          </Button>
          <Button
            className={clsx(styles['footer-button'], isDark && '!primary-button-dark')}
            type="primary"
            onClick={handleApply}>
            Apply
          </Button>
        </Flex>
      </>
    );
  }, [handleApply, handleClearAll, isDark]);

  return (
    <Drawer
      className={`${styles['dropdown-phone']} ${isDark && styles['dropdown-phone-dark']} ${params.wrapClassName || ''}`}
      placement="top"
      maskClosable={false}
      title={
        <div className={clsx('flex items-center justify-between', isDark ? 'text-pixelsDivider' : 'text-neutralTitle')}>
          <span className={clsx('text-xl font-semibold', isDark ? 'text-pixelsDivider' : 'text-neutralTitle')}>
            {titleTxt}
          </span>
          <CloseSVG className={clsx('size-4', isDark && 'fill-pixelsDivider')} onClick={onCloseHandler} />
        </div>
      }
      closeIcon={null}
      push={false}
      open={showDropMenu}
      height={'100%'}
      footer={footer}
      onClose={onCloseHandler}>
      <div>
        <CollapseForPC items={items} {...params} theme={theme} />
      </div>
    </Drawer>
  );
};

export { CollapseForPC, CollapseForPhone };
