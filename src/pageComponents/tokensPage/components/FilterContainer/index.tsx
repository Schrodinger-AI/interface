import { Drawer, Menu, MenuProps } from 'antd';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import styles from './style.module.css';

function CollapseForPC(props: MenuProps) {
  return (
    <Menu
      {...props}
      // TODO: rotate
      expandIcon={<ArrowSVG className="!size-4" />}
      className={`${styles['items-side-menu']}`}
      selectable={false}
      mode="inline"
    />
  );
}

interface IDropMenu extends MenuProps {
  showDropMenu: boolean;
  onCloseHandler: () => void;
  titleTxt?: string;
  wrapClassName?: string;
}

const CollapseForPhone = ({ showDropMenu, items, onCloseHandler, titleTxt = 'Filters', ...params }: IDropMenu) => {
  return (
    <Drawer
      className={`${styles['elf-dropdown-phone-dark']} ${params.wrapClassName || ''}`}
      placement="top"
      maskClosable={false}
      title={
        <div className="flex items-center justify-between pr-[20px]">
          <span className="text-[24px] leading-[32px] font-medium text-[var(--text-item)]">{titleTxt}</span>
          <CloseSVG onClick={onCloseHandler} />
        </div>
      }
      closeIcon={null}
      push={false}
      open={showDropMenu}
      height={'100%'}
      onClose={onCloseHandler}>
      <div className="px-[8px] pt-[16px]">
        <CollapseForPC items={items} {...params} />
      </div>
    </Drawer>
  );
};

export { CollapseForPC, CollapseForPhone };
