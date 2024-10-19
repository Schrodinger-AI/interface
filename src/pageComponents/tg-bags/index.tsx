/* eslint-disable @next/next/no-img-element */
'use client';

import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import { Tabs } from 'antd';
import MyCatsModule from './components/MyCatsModule';
import MyBoxModule from './components/MyBoxModule';
import ItemsModule from './components/ItemsModule';
import { GetAdoptionVoucherAmount } from 'contract/schrodinger';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.module.css';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

export default function TgHome() {
  const { walletInfo } = useConnectWallet();
  const { isLogin } = useGetLoginStatus();
  const [amount, setAmount] = useState<number>(0);

  const getTickAmount = useCallback(async () => {
    console.log('getTickAmount');
    if (!walletInfo?.address || !isLogin) return;
    try {
      const { value } = await GetAdoptionVoucherAmount({ tick: 'SGR', account: walletInfo?.address });
      console.log('value', value);
      setAmount(Number(value) || 0);
    } catch (error) {
      /* empty */
    }
  }, [walletInfo, isLogin]);

  const data = useMemo(
    () => [{ src: require('assets/img/telegram/spin/CatTicket.png').default.src as string, amount }],
    [amount],
  );

  useEffect(() => {
    getTickAmount();
  }, [getTickAmount]);

  return (
    <div className={clsx('max-w-[2560px] w-full h-[100vh] min-h-screen p-[16px] bg-neutralTitle')}>
      <BackCom className="w-full" theme="dark" />
      <Tabs
        defaultActiveKey="3"
        className={styles['customized-tabs']}
        items={[
          {
            label: 'My Cats',
            key: '1',
            children: <MyCatsModule />,
            disabled: true,
          },
          {
            label: 'My Box',
            key: '2',
            children: <MyBoxModule />,
            disabled: true,
          },
          {
            label: 'Items',
            key: '3',
            children: <ItemsModule data={data} onFinished={getTickAmount} />,
          },
        ]}
      />
    </div>
  );
}
