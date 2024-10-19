'use client';
import OwnedItems from 'components/OwnedItems';
import { ListTypeEnum } from 'types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCmsInfo } from 'redux/hooks';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import BackCom from './components/BackCom';
import { PAGE_CONTAINER_ID } from 'constants/index';
import CommonTabs from 'components/CommonTabs';
import { TabsProps } from 'antd';
import ItemsModule from 'pageComponents/tg-bags/components/ItemsModule';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { GetAdoptionVoucherAmount } from 'contract/schrodinger';

const pageStateList: TabsProps['items'] = [
  // {
  //   key: `${ListTypeEnum.All}`,
  //   label: 'All Cats',
  // },
  {
    key: `${ListTypeEnum.My}`,
    label: 'My Cats',
  },
  {
    key: `${ListTypeEnum.Blind}`,
    label: 'Cat Box',
  },
  {
    key: `${ListTypeEnum.Voucher}`,
    label: 'Items',
  },
];

export default function TokensPage() {
  const searchParams = useSearchParams();
  const pageState: ListTypeEnum = useMemo(
    () => (Number(searchParams.get('pageState')) as ListTypeEnum) || ListTypeEnum.My,
    [searchParams],
  );
  const router = useRouter();
  const { isLogin } = useGetLoginStatus();
  const { checkLogin } = useCheckLoginAndToken();
  const [amount, setAmount] = useState<number>(0);
  const { walletInfo } = useConnectWallet();

  const cmsInfo = useCmsInfo();

  const getTickAmount = useCallback(async () => {
    if (!walletInfo?.address || !isLogin) return;
    try {
      const { value } = await GetAdoptionVoucherAmount({ tick: 'SGR', account: walletInfo?.address });
      console.log('value', value);
      setAmount(Number(value) || 0);
    } catch (error) {
      /* empty */
    }
  }, [walletInfo, isLogin]);

  useEffect(() => {
    if (pageState === ListTypeEnum.Voucher) {
      getTickAmount();
    }
  }, [getTickAmount, pageState]);

  const onTabsChange = (value: ListTypeEnum) => {
    if ([ListTypeEnum.My, ListTypeEnum.Voucher].includes(value)) {
      if (!isLogin) {
        checkLogin({
          onSuccess: () => {
            router.replace(`/telegram/?pageState=${value}`);
          },
        });
        return;
      }
    }
    router.replace(`/telegram/?pageState=${value}`);
  };

  return (
    <div className="flex flex-col max-w-[2560px] w-full h-full overflow-scroll bg-pixelsPageBg" id={PAGE_CONTAINER_ID}>
      <BackCom className="mt-6 m-4 ml-4 lg:ml-10" url="/telegram/home" theme="dark" />
      <div
        className={clsx(
          'flex flex-col-reverse lg:flex-row justify-between px-0 lg:px-[40px]',
          cmsInfo?.bannerConfig ? 'mt-[24px]' : 'mt-0',
        )}>
        <CommonTabs
          options={pageStateList}
          activeKey={`${pageState}`}
          onTabsChange={(value) => onTabsChange(Number(value) as ListTypeEnum)}
          theme="dark"
          className="mb-[16px] lg:mb-0 px-[16px] lg:px-0 w-full lg:w-[364px]"
        />
      </div>

      <div className="px-4 lg:px-10">
        {pageState === ListTypeEnum.Voucher ? (
          <ItemsModule
            data={[{ src: require('assets/img/telegram/spin/CatTicket.png').default.src as string, amount }]}
            onFinished={getTickAmount}
          />
        ) : (
          <OwnedItems theme="dark" hideFilter={pageState === ListTypeEnum.Blind} />
        )}
      </div>
    </div>
  );
}
