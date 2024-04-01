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
import { useRouter } from 'next/navigation';
import { WalletType, WebLoginEvents, useWebLoginEvent } from 'aelf-web-login';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ReactComponent as MenuIcon } from 'assets/img/menu.svg';
import { ReactComponent as ArrowIcon } from 'assets/img/right_arrow.svg';
import { NavHostTag } from 'components/HostTag';
import useResponsive from 'hooks/useResponsive';
import { ENVIRONMENT } from 'constants/url';
import { ICompassProps, RouterItemType } from './type';
import MarketModal from 'components/MarketModal';
import { useModal } from '@ebay/nice-modal-react';
import { CompassLink, CompassText } from './components/CompassLink';
import { openExternalLink } from 'utils/openlink';
import useDeviceCmsConfig from 'redux/hooks/useDeviceConfig';

export default function Header() {
  const { checkLogin, checkTokenValid } = useCheckLoginAndToken();
  const { logout, wallet, isLogin, walletType } = useWalletService();
  const [, setCopied] = useCopyToClipboard();
  const { isLG } = useResponsive();
  const router = useRouter();
  const marketModal = useModal(MarketModal);

  const [menuModalVisibleModel, setMenuModalVisibleModel] = useState<ModalViewModel>(ModalViewModel.NONE);
  const { routerItems } = useDeviceCmsConfig() || {};

  const menuItems = useMemo(() => {
    let lists: Array<ICompassProps> = [];
    lists = routerItems?.items.filter((i) => i.show) || [];
    if (!isLogin) {
      return (lists = lists.filter((i) => i.title !== 'Stray Cats'));
    }
    return lists;
  }, [isLogin, routerItems?.items]);

  const onPressCompassItems = useCallback(
    (item: ICompassProps) => {
      const { type, schema, title } = item;

      if (type === RouterItemType.ExternalLink) {
        const newWindow = openExternalLink(schema, '_blank');
        if (newWindow && typeof newWindow.focus === 'function') {
          newWindow.focus();
        }
        return;
      }

      if (type === RouterItemType.MarketModal) {
        setMenuModalVisibleModel(ModalViewModel.NONE);
        marketModal.show();
        return;
      }

      setMenuModalVisibleModel(ModalViewModel.NONE);
      router.push(schema || '/');
    },
    [marketModal, router],
  );

  const [logoutComplete, setLogoutComplete] = useState(true);

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    setLogoutComplete(true);
    setMenuModalVisibleModel(ModalViewModel.NONE);
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

  // const StrayCatsItem = useCallback(() => {
  //   return (
  //     <div
  //       className={styles.menuItem}
  //       onClick={() => {
  //         if (checkTokenValid()) {
  //           router.push('/stray-cats');
  //           setMenuModalVisibleModel(ModalViewModel.NONE);
  //         } else {
  //           checkLogin();
  //         }
  //       }}>
  //       <StrayCats />
  //       <span>Stray Cats</span>
  //     </div>
  //   );
  // }, [checkLogin, checkTokenValid, router]);

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
    let menuItems = [
      {
        key: 'address',
        label: <CopyAddressItem />,
      },
      { key: 'asset', label: <AssetItem /> },
      // { key: 'stray cats', label: <StrayCatsItem /> },
      { key: 'points', label: <PointsItem /> },
      {
        key: 'logout',
        label: <LogoutItem />,
      },
    ];
    if (walletType !== WalletType.portkey) {
      menuItems.splice(1, 1);
    }

    const homeRoute = routerItems?.items.find((menu) => {
      return menu.title === 'Inscriptions';
    });
    if (homeRoute && !homeRoute?.show) {
      menuItems = menuItems.filter((menuItem) => {
        return menuItem.key !== 'asset';
      });
    }

    return menuItems;
  }, [AssetItem, CopyAddressItem, LogoutItem, PointsItem, walletType]);

  const firstClassCompassItems = useMemo(() => {
    const _menuItems = [...menuItems];

    return _menuItems.map((item) => {
      return {
        key: item.title,
        label: (
          <div
            className="flex flex-row items-center justify-between cursor-pointer w-[100%]"
            onClick={(event) => {
              event.preventDefault();
              onPressCompassItems(item);
            }}>
            <div className="text-lg">{item.title}</div>
            <ArrowIcon className="size-4" />
          </div>
        ),
      };
    });
  }, [menuItems, onPressCompassItems]);

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
        <span className="space-x-8 xl:space-x-16 flex flex-row items-center">
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
                            item={sub}
                            className="text-neutralPrimary rounded-[12px] hover:text-brandHover"
                            onPressCompassItems={onPressCompassItems}
                          />
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
                  item={item}
                  className="text-neutralPrimary rounded-[12px] hover:text-brandHover"
                  onPressCompassItems={onPressCompassItems}
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

  const handleRoute = () => {
    const homeRoute = routerItems?.items.find((menu) => {
      return menu.title === 'Inscriptions';
    });
    if (homeRoute && !homeRoute?.show) {
      return;
    }

    router.replace('/');
  };

  return (
    <section className="bg-white sticky top-0 left-0 z-[100] flex-shrink-0">
      {env === ENVIRONMENT.TEST && (
        <p className=" w-full bg-[#FEEFF1] p-[16px] text-sm text-[#F55D6E] font-medium text-center">
          Schrödinger is currently in the alpha stage and is primarily used for testing purposes. Please use it with
          caution, as user data may be subject to deletion.
        </p>
      )}

      <div className="px-[16px] md:px-[40px] h-[60px] md:h-[80px] mx-auto flex justify-between items-center w-full">
        <div className="flex flex-1 overflow-hidden justify-start items-center" onClick={handleRoute}>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={require('assets/img/logo.png').default.src}
              alt="logo"
              className="w-[150px] h-[24px] md:w-[200px] md:h-[32px]"
            />
          }
          <NavHostTag />
        </div>
        {FunctionalArea(menuItems)}
      </div>
      <Modal
        mask={false}
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
