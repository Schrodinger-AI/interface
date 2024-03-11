'use client';
import { Button, Dropdown } from 'aelf-design';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import Image from 'next/image';
import { ReactComponent as MenuMySVG } from 'assets/img/menu-my.svg';
import { ReactComponent as WalletSVG } from 'assets/img/wallet.svg';
import { ReactComponent as CopySVG } from 'assets/img/copy.svg';
import { ReactComponent as ExitSVG } from 'assets/img/exit.svg';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import { ReactComponent as PointsSVG } from 'assets/img/points.svg';
import { ReactComponent as AssetSVG } from 'assets/img/asset.svg';
import { MenuProps, message, Modal } from 'antd';
import styles from './style.module.css';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils/addressFormatting';
import { useCopyToClipboard } from 'react-use';
import { useResponsive } from 'ahooks';
import { useMemo, useState } from 'react';
import { WalletType } from 'aelf-web-login';
import { useRouter } from 'next/navigation';
import { store } from 'redux/store';
import { setLoginTrigger } from 'redux/reducer/info';

export default function Header() {
  const { isOK, checkLogin } = useCheckLoginAndToken();
  const { logout, wallet, isLogin, walletType } = useWalletService();
  const [, setCopied] = useCopyToClipboard();
  const responsive = useResponsive();
  const router = useRouter();

  const [menuModalVisible, setMenuModalVisible] = useState(false);

  const CopyAddressItem = () => {
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
  };

  const LogoutItem = () => {
    return (
      <div
        className="flex gap-[8px] items-center"
        onClick={() => {
          logout();
          setMenuModalVisible(false);
        }}>
        <ExitSVG />
        <span>Log out</span>
      </div>
    );
  };

  const PointsItem = () => {
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
  };

  const AssetItem = () => {
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
  };

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
      return menuItems.splice(1, 1);
    }
    return menuItems;
  }, [walletType]);

  const MyDropDown = () => {
    if (responsive.md) {
      return (
        <Dropdown menu={{ items }} overlayClassName={styles.dropdown} placement="bottomRight">
          <Button type="default" className="!rounded-[12px] !border-[#3888FF] !text-[#3888FF]" size="large">
            <MenuMySVG className="mr-[8px]" />
            My
          </Button>
        </Dropdown>
      );
    }
    return (
      <Button
        type="default"
        className="!rounded-lg !border-[#3888FF] !text-[#3888FF]"
        size="small"
        onClick={() => {
          setMenuModalVisible(true);
        }}>
        <MenuMySVG className="mr-[8px]" />
        My
      </Button>
    );
  };
  return (
    <section className="bg-white sticky top-0 left-0 z-[100] flex-shrink-0">
      <div className="max-w-[1440px] px-[16px] md:px-[40px] h-[60px] md:h-[80px] mx-auto flex justify-between items-center w-full">
        <Image
          src={require('assets/img/website-logo.svg').default}
          alt="logo"
          width={responsive.md ? 200 : 150}
          height={responsive.md ? 32 : 24}
        />
        {!isLogin ? (
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
        )}
      </div>
      <Modal
        className={styles.menuModal}
        footer={null}
        closeIcon={<CloseSVG />}
        title="My"
        open={menuModalVisible}
        closable
        destroyOnClose
        onCancel={() => {
          setMenuModalVisible(false);
        }}>
        {items.map((item, index) => {
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
