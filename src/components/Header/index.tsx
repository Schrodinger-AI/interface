'use client';
import { Button, Dropdown } from 'aelf-design';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { ReactComponent as MenuMySVG } from 'assets/img/menu-my.svg';
import { ReactComponent as NoticeSVG } from 'assets/img/notice.svg';
import { ReactComponent as ExitSVG } from 'assets/img/exit.svg';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import { ReactComponent as LeftArrow } from 'assets/img/icons/left-arrow.svg';
import { Badge, Modal } from 'antd';
import styles from './style.module.css';
import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { WalletType, WebLoginEvents, useWebLoginEvent } from 'aelf-web-login';
import { ReactComponent as MenuIcon } from 'assets/img/menu.svg';
import { ReactComponent as ArrowIcon } from 'assets/img/right_arrow.svg';
import { NavHostTag } from 'components/HostTag';
import useResponsive from 'hooks/useResponsive';
import { ENVIRONMENT } from 'constants/url';
import { ICompassProps, RouterItemType } from './type';
import MarketModal from 'components/MarketModal';
import { useModal } from '@ebay/nice-modal-react';
import { CompassLink } from './components/CompassLink';
import { openExternalLink } from 'utils/openlink';
import clsx from 'clsx';
import CopyAddressItem from './components/CopyAddressItem';
import AssetItem from './components/AssetItem';
import PointsItem from './components/PointsItem';
import useGetCustomTheme from 'redux/hooks/useGetCustomTheme';
import { CustomThemeType } from 'redux/types/reducerTypes';
import MenuDropdown from './components/MenuDropdown';
import MenuCollapse from './components/MenuCollapse/MenuCollapse';
import { SHOW_RANKING_ENTRY, NEED_LOGIN_PAGE } from 'constants/router';

import { useCmsInfo } from 'redux/hooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { store } from 'redux/store';
import { setCurViewListType } from 'redux/reducer/info';
import { ListTypeEnum } from 'types';
import StrayCatsItem from './components/StrayCatsItem';
import NoticeDrawer from './components/NoticeDrawer';
import useGetStoreInfo from 'redux/hooks/useGetStoreInfo';

export default function Header() {
  const { checkLogin, checkTokenValid } = useCheckLoginAndToken();
  const { logout, wallet, walletType } = useWalletService();
  const { isLogin } = useGetLoginStatus();
  const { unreadMessagesCount } = useGetStoreInfo();

  const { isLG } = useResponsive();
  const router = useRouter();
  const marketModal = useModal(MarketModal);
  const customTheme = useGetCustomTheme();
  const pathname = usePathname();
  const [noticeOpen, setNoticeOpen] = useState<boolean>(false);

  const [menuModalVisibleModel, setMenuModalVisibleModel] = useState<ModalViewModel>(ModalViewModel.NONE);
  const cmsInfo = useCmsInfo();

  const routerItems = useMemo(() => {
    return cmsInfo?.routerItems || [];
  }, [cmsInfo?.routerItems]);

  const [rankListEntranceOpen, setRankListEntranceOpen] = useState<boolean>(!!cmsInfo?.rankListEntrance?.open);

  const menuItems = useMemo(() => {
    let lists: Array<ICompassProps> = [];
    lists = routerItems?.filter((i) => i.show) || [];
    if (!isLogin) {
      return (lists = lists.filter((i) => i.title !== 'Stray Cats'));
    }
    return lists;
  }, [isLogin, routerItems]);

  const onPressCompassItems = useCallback(
    (item: ICompassProps) => {
      const { type, schema, title } = item;

      if (schema && NEED_LOGIN_PAGE.includes(schema)) {
        if (!isLogin) {
          checkLogin({
            onSuccess: () => {
              router.push(schema || '/');
              if (schema === '/my-cats') {
                store.dispatch(setCurViewListType(ListTypeEnum.My));
              }
              setMenuModalVisibleModel(ModalViewModel.NONE);
            },
          });
          return;
        }
      }

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
      if (schema === '/') {
        store.dispatch(setCurViewListType(ListTypeEnum.All));
      }
    },
    [checkLogin, isLogin, marketModal, router],
  );

  const [logoutComplete, setLogoutComplete] = useState(true);

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    setLogoutComplete(true);
    setMenuModalVisibleModel(ModalViewModel.NONE);
  });

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

  const closeMenuModal = () => {
    setMenuModalVisibleModel(ModalViewModel.NONE);
  };

  const checkAndRedirect = useCallback(
    (path: string) => {
      if (checkTokenValid()) {
        router.push(path);
        setMenuModalVisibleModel(ModalViewModel.NONE);
      } else {
        checkLogin({
          onSuccess: () => {
            router.push(path);
            setMenuModalVisibleModel(ModalViewModel.NONE);
          },
        });
      }
    },
    [checkLogin, checkTokenValid, router],
  );

  const items = useMemo(() => {
    const menuItems = [
      {
        key: 'address',
        label: <CopyAddressItem address={wallet.address} />,
      },
      {
        key: 'asset',
        label: <AssetItem closeMenuModal={closeMenuModal} />,
      },
      { key: 'strayCats', label: <StrayCatsItem checkAndRedirect={checkAndRedirect} /> },
      { key: 'points', label: <PointsItem checkAndRedirect={checkAndRedirect} /> },
      {
        key: 'logout',
        label: <LogoutItem />,
      },
    ];
    if (walletType !== WalletType.portkey) {
      menuItems.splice(1, 1);
    }

    return menuItems;
  }, [wallet.address, checkAndRedirect, LogoutItem, walletType]);

  const firstClassCompassItems = useMemo(() => {
    const _menuItems = [...menuItems];

    return _menuItems.map((item) => {
      if (item.items?.length) {
        return {
          key: item.title,
          label: (
            <MenuCollapse
              title={
                <div className="flex flex-row items-center justify-between cursor-pointer w-[100%]">
                  <div className="text-lg">{item.title}</div>
                </div>
              }
              item={item}
              onPressCompassItems={onPressCompassItems}
            />
          ),
        };
      } else {
        return {
          key: item.title,
          label: (
            <div
              className="flex flex-row items-center justify-between cursor-pointer w-[100%] px-[16px]"
              onClick={(event) => {
                event.preventDefault();
                onPressCompassItems(item);
              }}>
              <div className="text-lg">{item.title}</div>
              <ArrowIcon className="size-4" />
            </div>
          ),
        };
      }
    });
  }, [menuItems, onPressCompassItems]);

  const onOpenNotice = () => {
    if (isLG) {
      router.push('/notification');
    } else {
      setNoticeOpen(true);
    }
  };

  const FunctionalArea = (itemList: Array<ICompassProps>) => {
    const myComponent = !isLogin ? (
      <Button
        type="primary"
        size={!isLG ? 'large' : 'small'}
        className="!rounded-lg lg:!rounded-[12px]"
        disabled={!logoutComplete}
        onClick={() => {
          checkLogin();
        }}>
        Log in
      </Button>
    ) : (
      <div className="flex items-center">
        <MyDropDown />
        <Badge count={unreadMessagesCount} showZero={false} size={isLG ? 'small' : 'default'}>
          <Button
            type="default"
            className={clsx(
              '!rounded-[8px] lg:!rounded-[12px] !w-[32px] !min-w-[32px] !h-[32px] lg:!w-[48px] lg:!min-w-[48px] lg:!h-[48px] !p-0 ml-[8px] lg:ml-[12px]',
              styles['button-my'],
            )}
            size="large"
            onClick={onOpenNotice}>
            <NoticeSVG className="scale-[0.7] lg:scale-100" />
          </Button>
        </Badge>
      </div>
    );
    if (!isLG) {
      return (
        <span className="space-x-8 xl:space-x-12 flex flex-row items-center">
          {itemList.map((item) => {
            const { title, items = [], schema } = item;
            if (items?.length > 0) {
              return (
                <MenuDropdown
                  key={title}
                  title={title}
                  schema={schema}
                  items={items}
                  onPressCompassItems={onPressCompassItems}
                />
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
          <MenuIcon
            className={clsx('size-8', styles['mobile-menu-icon'])}
            onClick={() => setMenuModalVisibleModel(ModalViewModel.MENU)}
          />
        </span>
      );
    }
  };

  const MyDropDown = () => {
    if (!isLG) {
      return (
        <Dropdown menu={{ items }} overlayClassName={styles.dropdown} placement="bottomRight">
          <Button
            type="default"
            className={clsx('!rounded-[12px] !w-[48px] !min-w-[48px] !h-[48px] !p-0', styles['button-my'])}
            size="large">
            <MenuMySVG />
          </Button>
        </Dropdown>
      );
    }
    return (
      <Button
        type="default"
        className={clsx('!rounded-[8px] !w-[32px] !min-w-[32px] !h-[32px] !p-0', styles['button-my'])}
        size="small"
        onClick={() => {
          setMenuModalVisibleModel(ModalViewModel.MY);
        }}>
        <MenuMySVG className="scale-[0.7]" />
      </Button>
    );
  };

  const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

  const handleRoute = () => {
    const homeRoute = routerItems?.find((menu) => {
      return menu.title === 'Inscriptions';
    });
    if (homeRoute && !homeRoute?.show) {
      return;
    }

    router.replace('/');
  };

  const logoImage = useMemo(() => {
    return {
      [CustomThemeType.light]: require('assets/img/logo.svg').default,
      [CustomThemeType.dark]: require('assets/img/logoWhite.svg').default,
    }[customTheme.header.theme];
  }, [customTheme.header.theme]);

  const closeRankListEntrance = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setRankListEntranceOpen(false);
  };

  return (
    <section className={clsx('sticky top-0 left-0 z-[100] flex-shrink-0', styles[customTheme.header.theme])}>
      {env === ENVIRONMENT.TEST && (
        <p
          className={clsx('w-full p-[16px] text-sm text-[#F55D6E] font-medium text-center', styles['testnet-warning'])}>
          Schrödinger is currently in the alpha stage and is primarily used for testing purposes. Please use it with
          caution, as user data may be subject to deletion.
        </p>
      )}
      {SHOW_RANKING_ENTRY.includes(pathname) &&
      cmsInfo?.rankListEntrance?.open &&
      cmsInfo?.rankListEntrance?.title &&
      rankListEntranceOpen ? (
        <p
          className={clsx(
            'w-full p-[16px] relative text-sm flex items-center justify-center text-white font-medium text-center bg-brandDefault cursor-pointer',
          )}
          onClick={() => {
            router.push(cmsInfo.rankListEntrance?.link || '/rank-list');
          }}>
          <span className="flex-1 max-w-max">{cmsInfo.rankListEntrance.title}</span>

          <LeftArrow className="fill-white scale-50" />
          <div
            className="absolute px-[16px] h-full flex items-center justify-center right-0 top-0"
            onClick={closeRankListEntrance}>
            <CloseSVG className="fill-white w-[16px] h-[16px]" />
          </div>
        </p>
      ) : null}

      <div className="px-[16px] lg:px-[40px] h-[60px] lg:h-[80px] mx-auto flex justify-between items-center w-full">
        <div className="flex flex-1 overflow-hidden justify-start items-center" onClick={handleRoute}>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoImage}
              alt="logo"
              className="w-[120px] h-[24px] lg:w-[160px] lg:h-[32px]"
              onClick={() => router.replace('/')}
            />
          }
          <NavHostTag />
        </div>
        {customTheme.header.hideMenu ? null : FunctionalArea(menuItems)}
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
            <div className="w-full min-h-[64px] flex items-center text-base font-medium text-neutralTitle" key={index}>
              {item.label}
            </div>
          );
        })}
      </Modal>
      <NoticeDrawer open={noticeOpen} onClose={() => setNoticeOpen(false)} />
    </section>
  );
}

enum ModalViewModel {
  NONE,
  MY,
  MENU,
}
