/* eslint-disable @next/next/no-img-element */
'use client';

import clsx from 'clsx';
import BackCom from 'pageComponents/telegram/tokensPage/components/BackCom';
import { Tabs } from 'antd';
import MyCatsModule from './components/MyCatsModule';
import MyBoxModule from './components/MyBoxModule';
import ItemsModule from './components/ItemsModule';
import { GetAdoptionVoucherAmount } from 'contract/schrodinger';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

export default function TgHome() {
  const { walletInfo } = useConnectWallet();
  const { isLogin } = useGetLoginStatus();
  const [amount, setAmount] = useState<number>(0);

  const getTickAmount = useCallback(async () => {
    if (!walletInfo?.address || !isLogin) return;
    try {
      const amount = await GetAdoptionVoucherAmount({ tick: 'SGR', account: walletInfo?.address });
      console.log('amount', amount);
      setAmount(Number(amount) || 0);
    } catch (error) {
      /* empty */
    }
  }, [walletInfo, isLogin]);

  useEffect(() => {
    getTickAmount();
  }, [getTickAmount]);

  return (
    <div className={clsx('max-w-[2560px] w-full min-h-screen p-[16px] bg-neutralTitle')}>
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
            children: (
              <ItemsModule
                data={[{ src: require('assets/img/telegram/spin/CatTicket.png').default.src as string, amount }]}
              />
            ),
          },
        ]}
      />

      {/* <TgModal
        title="Notice"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <p className="text-center text-white text-[12px] font-medium">
            Oh no, you do not have enough $Fish. Complete tasks to get more $Fish!
          </p>
          <TGButton type="success" className="w-full mt-[24px]">
            <GoSVG />
          </TGButton>
        </div>
      </TgModal>

      <TgModal
        title="Notice"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <Flex align="center" gap={24} vertical>
            <p className="text-center text-white leading-[22px] text-[14px] font-medium">You won n* $Fish!</p>
            <img
              src={require('assets/img/telegram/spin/prize.png').default.src}
              alt=""
              className="w-[96px] h-[96px] rounded-[8px] z-10"
            />
            <p className="text-center text-white text-[12px] font-medium">Ready for your next spin?</p>
          </Flex>
          <TGButton type="success" className="w-full mt-[24px]">
            <SpinSVG />
          </TGButton>
        </div>
      </TgModal>

      <TgModal
        title="DETAILS"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <Flex align="center" gap={24} vertical>
            <img
              src={require('assets/img/telegram/spin/ticket.png').default.src}
              alt=""
              className="w-[140px] h-[140px] rounded-[8px] z-10"
            />
            <Flex gap={4} align="center" vertical>
              <VoucherSVG />
              <p className="text-center text-white text-[14px] font-semibold">Quantity: XX</p>
            </Flex>
            <p className="text-center leading-[20px] text-white text-[12px] font-medium">
              Use your voucher to adopt a GEN9 cat for free! You get to keep Rare GEN9 cats, but be aware that Common
              GEN9 cats will run off and disappear.
            </p>
            <p className="text-center leading-[20px] text-white text-[12px] font-medium">Good luck!</p>
          </Flex>
          <TGButton type="success" className="w-full mt-[24px]">
            <AdoptSVG />
          </TGButton>
        </div>
      </TgModal>

      <TgModal
        title="DETAILS"
        open={isOpen}
        hideHeader={false}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}>
        <div className="p-[8px]">
          <Flex align="center" gap={24} vertical>
            <img
              src={require('assets/img/loading-cat-white.gif').default.src}
              alt=""
              className="w-[120px] h-[120px] rounded-[8px] z-10"
            />
            <Flex align="stretch" gap={16} className="p-[16px] bg-pixelsModalTextBg rounded-[8px]">
              <div className="flex items-center w-[20px] shrink">
                <InfoSVG />
              </div>
              <p className="text-white leading-[22px] text-[14px] font-medium ">
                Please do not close this window until adoption is completed
              </p>
            </Flex>
          </Flex>
        </div>
      </TgModal> */}
    </div>
  );
}
