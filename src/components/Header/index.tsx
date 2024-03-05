'use client';
import { Button, Dropdown } from 'aelf-design';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import Image from 'next/image';
import { ReactComponent as MenuMySVG } from 'assets/img/menu-my.svg';
import { ReactComponent as WalletSVG } from 'assets/img/wallet.svg';
import { ReactComponent as CopySVG } from 'assets/img/copy.svg';
import { ReactComponent as ExitSVG } from 'assets/img/exit.svg';
import { ReactComponent as CloseSVG } from 'assets/img/close.svg';
import { MenuProps, message, Modal } from 'antd';
import styles from './style.module.css';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils';
import { useCopyToClipboard } from 'react-use';
import { useResponsive } from 'ahooks';
import { useState } from 'react';

export default function Header() {
  const { isOK, checkLogin } = useCheckLoginAndToken();
  const { logout, wallet, isLogin } = useWalletService();
  const [, setCopied] = useCopyToClipboard();
  const responsive = useResponsive();

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
        <span>logout</span>
      </div>
    );
  };

  const items = [
    {
      key: 'address',
      label: <CopyAddressItem />,
    },
    {
      key: 'logout',
      label: <LogoutItem />,
    },
  ];

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
    <section className="bg-white sticky top-0 left-0 z-5 flex-shrink-0">
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
              checkLogin();
            }}>
            Log In
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
