'use client';
import { Button, Dropdown } from 'aelf-design';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { ReactComponent as MenuMySVG } from 'assets/img/menu-my.svg';
import { ReactComponent as WalletSVG } from 'assets/img/wallet.svg';
import { ReactComponent as CopySVG } from 'assets/img/copy.svg';
import { ReactComponent as ExitSVG } from 'assets/img/exit.svg';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import { ReactComponent as PointsSVG } from 'assets/img/points.svg';
import { ReactComponent as StrayCats } from 'assets/img/strayCats.svg';
import { ReactComponent as AssetSVG } from 'assets/img/asset.svg';
import { message, Modal } from 'antd';
import styles from './style.module.css';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { useCopyToClipboard } from 'react-use';
import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { WalletType, WebLoginEvents, useWebLoginEvent } from 'aelf-web-login';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';
import { useCmsInfo } from 'redux/hooks';
import Link from 'next/link';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ReactComponent as MenuIcon } from 'assets/img/menu.svg';
import { ReactComponent as ArrowIcon } from 'assets/img/right_arrow.svg';
import { NavHostTag } from 'components/HostTag';
import useResponsive from 'hooks/useResponsive';
import { ENVIRONMENT } from 'constants/url';
import useSafeAreaHeight from 'hooks/useSafeAreaHeight';

export default function Header() {
  const { checkLogin, checkTokenValid } = useCheckLoginAndToken();
  const { logout, wallet, isLogin, walletType } = useWalletService();
  const [, setCopied] = useCopyToClipboard();
  const { isLG } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();

  const [menuModalVisibleModel, setMenuModalVisibleModel] = useState<ModalViewModel>(ModalViewModel.NONE);
  const { routerItems = '{}' } = useCmsInfo() || {};
  const menuItems = useMemo(() => {
    let lists: Array<ICompassProps> = [];
    try {
      const parsed = JSON.parse(routerItems) as ICompassProps;
      lists = parsed.items || [];
    } catch (e) {
      console.error(e, 'parse routerItems failed');
    }
    return lists;
  }, [routerItems]);

  const onPressCompassItems = useCallback(
    (event: any, to: string, type: ICompassType = 'inner') => {
      if (type === 'externalLink') {
        event.preventDefault();
        const newWindow = window.open(to, '_blank');
        newWindow && (newWindow.opener = null);
        if (newWindow && typeof newWindow.focus === 'function') {
          newWindow.focus();
        }
      } else {
        // type === 'inner';
        if (!isLogin) {
          event.preventDefault();
          store.dispatch(setLoginTrigger('login'));
          checkLogin();
        } else {
          setMenuModalVisibleModel(ModalViewModel.NONE);
          router.push(to);
        }
      }
    },
    [checkLogin, isLogin, router],
  );

  const [logoutComplete, setLogoutComplete] = useState(true);

  const [menuModalVisible, setMenuModalVisible] = useState(false);

  const { topSafeHeight } = useSafeAreaHeight();

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    setLogoutComplete(true);
    setMenuModalVisible(false);
  });

  const CopyAddressItem = useCallback(() => {
    return (
      <div className={styles.menuItem}>
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
        className={styles.menuItem}
        onClick={() => {
          setLogoutComplete(false);
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
      <div
        className={styles.menuItem}
        onClick={() => {
          if (checkTokenValid()) {
            router.push('/points');
            setMenuModalVisibleModel(ModalViewModel.NONE);
          } else {
            checkLogin();
          }
        }}>
        <PointsSVG />
        <span>My Flux Points</span>
      </div>
    );
  }, [checkLogin, checkTokenValid, router]);

  const StrayCatsItem = useCallback(() => {
    return (
      <div
        className={styles.menuItem}
        onClick={() => {
          if (checkTokenValid()) {
            router.push('/stray-cats');
            setMenuModalVisibleModel(ModalViewModel.NONE);
          } else {
            checkLogin();
          }
        }}>
        <StrayCats />
        <span>Stray Cats</span>
      </div>
    );
  }, [checkLogin, checkTokenValid, router]);

  const AssetItem = useCallback(() => {
    return (
      <div
        className={styles.menuItem}
        onClick={() => {
          router.push('/assets');
          setMenuModalVisibleModel(ModalViewModel.NONE);
        }}>
        <AssetSVG />
        <span>My Assets</span>
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
      { key: 'stray cats', label: <StrayCatsItem /> },
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
  }, [AssetItem, CopyAddressItem, LogoutItem, StrayCatsItem, PointsItem, walletType]);

  const firstClassCompassItems = useMemo(() => {
    return menuItems.map((item) => {
      return {
        key: item.title,
        label: (
          <div
            className="flex flex-row items-center justify-between cursor-pointer w-[100%]"
            onClick={(event) => {
              item?.schema && onPressCompassItems(event, item?.schema, item.type);
            }}>
            <div className="text-lg">{item.title}</div>
            <ArrowIcon className="size-4" />
          </div>
        ),
      };
    });
  }, [menuItems, onPressCompassItems]);

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

  const CompassLink = ({ to, type, title, ...props }: any & React.RefAttributes<HTMLAnchorElement>) => {
    const isInner = type !== 'out';
    const renderCom = <CompassText title={title} schema={to} />;

    return isInner ? (
      <span onClick={(event) => onPressCompassItems(event, to, type)}>{renderCom}</span>
    ) : (
      <Link
        href={!isLogin ? '' : to}
        scroll={false}
        onClick={(event) => {
          onPressCompassItems(event, to, type);
        }}
        {...props}>
        {renderCom}
      </Link>
    );
  };
  const FunctionalArea = (itemList: Array<ICompassProps>) => {
    const myComponent = !isLogin ? (
      <Button
        type="primary"
        size={!isLG ? 'large' : 'small'}
        className="!rounded-lg md:!rounded-[12px]"
        disabled={!logoutComplete}
        onClick={() => {
          store.dispatch(setLoginTrigger('login'));
          checkLogin();
        }}>
        Log in
      </Button>
    ) : (
      <MyDropDown />
    );
    if (!isLG) {
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
                            to={sub.schema}
                            type={sub.type}
                            title={sub.title}
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
                  to={schema}
                  type={type}
                  title={title}
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
    if (!isLG) {
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

  const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

  return (
    <section className="bg-white sticky top-0 left-0 z-[100] flex-shrink-0">
      {env === ENVIRONMENT.TEST && (
        <p className=" w-full bg-brandBg p-[16px] lg:p-[20px] text-sm text-brandDefault font-medium text-center">
          Schrödinger is currently in the alpha stage and is primarily used for testing purposes. Please use it with
          caution, as user data may be subject to deletion.
        </p>
      )}

      <div className="px-[16px] md:px-[40px] h-[60px] md:h-[80px] mx-auto flex justify-between items-center w-full">
        <div className="flex justify-start items-center" onClick={() => router.replace('/')}>
          {/* <div className="flex relative">
            <img
              src={require('assets/img/logo.png').default.src}
              alt="logo"
              className="w-[150px] h-[24px] md:w-[200px] md:h-[32px]"
            />
            <span className="absolute flex items-center justify-center font-medium right-0 leading-[12px] lg:leading-[16px] text-[8px] lg:text-[10px] top-0 bg-neutralPrimary text-white px-[2px] lg:px-[4px] h-[12px] lg:h-[16px] rounded-[4px] rounded-bl-none">
              TEST
            </span>
          </div> */}
          <img
            src={require('assets/img/logo.png').default.src}
            alt="logo"
            className="w-[150px] h-[24px] md:w-[200px] md:h-[32px]"
          />
          <NavHostTag />
        </div>
        {FunctionalArea(menuItems)}
      </div>
      <Modal
        mask={false}
        className={styles.menuModal}
        footer={null}
        closeIcon={<CloseSVG />}
        style={{ paddingTop: Number(topSafeHeight) }}
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
