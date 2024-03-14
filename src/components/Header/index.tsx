'use client';
import { Button, Dropdown } from 'aelf-design';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { ReactComponent as MenuMySVG } from 'assets/img/menu-my.svg';
import { ReactComponent as WalletSVG } from 'assets/img/wallet.svg';
import { ReactComponent as CopySVG } from 'assets/img/copy.svg';
import { ReactComponent as ExitSVG } from 'assets/img/exit.svg';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import { ReactComponent as PointsSVG } from 'assets/img/points.svg';
import { ReactComponent as AssetSVG } from 'assets/img/asset.svg';
import { message, Modal } from 'antd';
import styles from './style.module.css';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { useCopyToClipboard } from 'react-use';
import { useResponsive } from 'ahooks';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { WalletType } from 'aelf-web-login';
import { usePathname, useRouter } from 'next/navigation';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';
import { useCmsInfo } from 'redux/hooks';
import Link from 'next/link';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ReactComponent as MenuIcon } from 'assets/img/menu.svg';
import { ReactComponent as ArrowIcon } from 'assets/img/right_arrow.svg';
import { ICompassProps, RouterItemType } from './type';
import { useModal } from '@ebay/nice-modal-react';
import MarketModal from 'components/MarketModal';

const mockRouterItems = JSON.stringify({
  items: [
    {
      title: 'Marketplace',
      schema: '',
      type: 'modal',
    },
  ],
});

export default function Header() {
  const { checkLogin } = useCheckLoginAndToken();
  const { logout, wallet, isLogin, walletType } = useWalletService();
  const [, setCopied] = useCopyToClipboard();
  const responsive = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const navigate = useRouter();
  const marketModal = useModal(MarketModal);

  const [menuModalVisibleModel, setMenuModalVisibleModel] = useState<ModalViewModel>(ModalViewModel.NONE);
  const { routerItems = '{}' } = useCmsInfo() || {};
  const menuItems = useMemo(() => {
    let lists: Array<ICompassProps> = [];
    try {
      const parsed = JSON.parse(routerItems) as ICompassProps;
      lists = parsed.items || [];
      console.log('menuItems', lists);
    } catch (e) {
      console.error(e, 'parse routerItems failed');
    }
    return lists;
  }, [routerItems]);

  const onPressCompassItems = useCallback(
    (event: any, to: string, isInner: boolean) => {
      console.log(to, isInner, 'to, isInner ', isLogin, 'isLogin');
      if (isInner) {
        if (!isLogin) {
          event.preventDefault();
          store.dispatch(setLoginTrigger('login'));
          checkLogin();
        } else {
          navigate.push(to);
        }
      } else {
        // open new tab
        event.preventDefault();
        const newWindow = window.open(to, '_blank');
        newWindow && (newWindow.opener = null);
        if (newWindow && typeof newWindow.focus === 'function') {
          newWindow.focus();
        }
      }
    },
    [checkLogin, isLogin, navigate],
  );

  const CopyAddressItem = useCallback(() => {
    return (
      <div className="flex gap-[8px] items-center">
        <WalletSVG />
        <span>{getOmittedStr(addPrefixSuffix(wallet.address), OmittedType.ADDRESS)}</span>
        <CopySVG
          onClick={() => {
            setCopied(addPrefixSuffix(wallet.address));
            message.success('Copied');
          }}
        />
      </div>
    );
  }, [setCopied, wallet.address]);

  const LogoutItem = useCallback(() => {
    return (
      <div
        className="flex gap-[8px] items-center"
        onClick={() => {
          logout();
          setMenuModalVisibleModel(ModalViewModel.NONE);
        }}>
        <ExitSVG />
        <span>Log out</span>
      </div>
    );
  }, [logout]);

  const PointsItem = useCallback(() => {
    return (
      <div className="flex gap-[8px] items-center">
        <AssetSVG />
        <span
          onClick={() => {
            router.push('/points');
          }}>
          My Points
        </span>
      </div>
    );
  }, [router]);

  const AssetItem = useCallback(() => {
    return (
      <div className="flex gap-[8px] items-center">
        <PointsSVG />
        <span
          onClick={() => {
            router.push('/assets');
          }}>
          My Asset
        </span>
      </div>
    );
  }, [router]);

  const items = useMemo(() => {
    const menuItems = [
      {
        key: 'address',
        label: <CopyAddressItem />,
      },
      { key: 'asset', label: <AssetItem /> },
      { key: 'points', label: <PointsItem /> },
      {
        key: 'logout',
        label: <LogoutItem />,
      },
    ];
    if (walletType !== WalletType.portkey) {
      menuItems.splice(1, 1);
    }
    return menuItems;
  }, [AssetItem, CopyAddressItem, LogoutItem, PointsItem, walletType]);

  const handleNavClick = useCallback(
    (event: any, itemData: ICompassProps) => {
      const { schema = '', type, title = '' } = itemData;

      if (type === RouterItemType.MODAL) {
        switch (title.toLocaleLowerCase()) {
          case 'marketplace':
            marketModal.show({ title });
            return;
          default:
            return;
        }
      }

      onPressCompassItems(event, schema, type !== RouterItemType.OUT);
    },
    [marketModal, onPressCompassItems],
  );

  const firstClassCompassItems = useMemo(() => {
    return menuItems.map((item) => {
      return {
        key: item.title,
        label: (
          <div
            className="flex flex-row items-center justify-between cursor-pointer w-[100%]"
            onClick={(event) => {
              handleNavClick(event, item);
              // item?.schema && onPressCompassItems(event, item?.schema, item.type !== RouterItemType.OUT);
            }}>
            <div className="text-lg">{item.title}</div>
            <ArrowIcon className="size-4" />
          </div>
        ),
      };
    });
  }, [handleNavClick, menuItems]);

  const CompassText = (props: { title?: string; schema?: string }) => {
    const isCurrent = pathname.includes(props.schema?.toLowerCase() ?? '');
    console.log('is Current ', isCurrent, props.title, props.schema, pathname);
    return (
      <span
        className={`!rounded-[12px] text-lg ${
          isCurrent ? 'text-compassActive' : 'text-compassNormal'
        } hover:text-compassActive cursor-pointer font-medium	`}>
        {props.title}
      </span>
    );
  };

  const CompassLink = ({ itemData, ...props }: { itemData: ICompassProps; className: string } & PropsWithChildren) => {
    const { title, schema: to = '' } = itemData;
    return (
      <Link
        href={!isLogin ? '' : to}
        scroll={false}
        onClick={(event) => {
          handleNavClick(event, itemData);
        }}
        {...props}>
        <CompassText title={title} schema={to} />
      </Link>
    );
  };
  const FunctionalArea = (itemList: Array<ICompassProps>) => {
    const myComponent = !isLogin ? (
      <Button
        type="primary"
        size={responsive.md ? 'large' : 'small'}
        className="!rounded-lg md:!rounded-[12px]"
        onClick={() => {
          store.dispatch(setLoginTrigger('login'));
          checkLogin();
        }}>
        Log in
      </Button>
    ) : (
      <MyDropDown />
    );
    if (responsive.md) {
      return (
        <span className="space-x-16 flex flex-row items-center">
          {itemList.map((item) => {
            const { title, items = [], schema, type } = item;
            if (items?.length > 0) {
              return (
                <Dropdown
                  key={title}
                  overlayClassName={styles.dropdown}
                  placement="bottomCenter"
                  menu={{
                    items: items.map((sub) => {
                      return {
                        key: sub.title,
                        type: 'group',
                        label: (
                          <CompassLink
                            key={sub.title}
                            itemData={item}
                            className="text-neutralPrimary rounded-[12px] hover:text-brandHover">
                            <CompassText title={sub.title} schema={sub.schema} />
                          </CompassLink>
                        ),
                      } as ItemType;
                    }),
                  }}>
                  <CompassText title={title} schema={schema} />
                </Dropdown>
              );
            } else {
              return (
                <CompassLink
                  key={title}
                  itemData={item}
                  className="text-neutralPrimary rounded-[12px] hover:text-brandHover"
                />
              );
            }
          })}
          <div>{myComponent}</div>
        </span>
      );
    } else {
      return (
        <span className="space-x-4 flex flex-row items-center">
          {myComponent}
          <MenuIcon className="size-8" onClick={() => setMenuModalVisibleModel(ModalViewModel.MENU)} />
        </span>
      );
    }
  };

  const MyDropDown = () => {
    if (responsive.md) {
      return (
        <Dropdown menu={{ items }} overlayClassName={styles.dropdown} placement="bottomRight">
          <Button type="default" className="!rounded-[12px] text-brandDefault border-brandDefault" size="large">
            <MenuMySVG className="mr-[8px]" />
            My
          </Button>
        </Dropdown>
      );
    }
    return (
      <Button
        type="default"
        className="!rounded-lg !border-brandDefault !text-brandDefault"
        size="small"
        onClick={() => {
          setMenuModalVisibleModel(ModalViewModel.MY);
        }}>
        <MenuMySVG className="mr-[8px]" />
        My
      </Button>
    );
  };
  return (
    <section className="bg-white sticky top-0 left-0 z-[100] flex-shrink-0">
      <div className="px-[16px] md:px-[40px] h-[60px] md:h-[80px] mx-auto flex justify-between items-center w-full">
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={require('assets/img/logo.png').default.src}
            alt="logo"
            width={responsive.md ? 200 : 150}
            height={responsive.md ? 32 : 24}
          />
        }
        {FunctionalArea(menuItems)}
      </div>
      <Modal
        className={styles.menuModal}
        footer={null}
        closeIcon={<CloseSVG className="size-4" />}
        title={menuModalVisibleModel === ModalViewModel.MY ? 'My' : 'Menu'}
        open={menuModalVisibleModel !== ModalViewModel.NONE}
        closable
        destroyOnClose
        onCancel={() => {
          setMenuModalVisibleModel(ModalViewModel.NONE);
        }}>
        {(menuModalVisibleModel === ModalViewModel.MY ? items : firstClassCompassItems).map((item, index) => {
          return (
            <div
              className="w-full h-[64px] flex items-center border-x-0 border-t-0 border-b-[1px] border-solid border-[#EDEDED] text-[16px] font-medium text-[#1A1A1A]"
              key={index}>
              {item.label}
            </div>
          );
        })}
      </Modal>
    </section>
  );
}

enum ModalViewModel {
  NONE,
  MY,
  MENU,
}
