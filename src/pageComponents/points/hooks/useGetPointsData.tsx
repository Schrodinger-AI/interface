import { useCallback } from 'react';
import useLoading from 'hooks/useLoading';
import { getDomain } from 'utils';
import { getPoints } from 'api/request';
import { useRequest } from 'ahooks';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export default function useGetPointsData() {
  const { showLoading, closeLoading } = useLoading();
  const { walletInfo } = useConnectWallet();
  const { isLogin } = useGetLoginStatus();

  const getPointsData = useCallback(
    async (address: string, callback?: (response: IGetPointsData) => void) => {
      if (!address || !isLogin) return;
      showLoading();
      const response = await getPoints({
        domain: getDomain(),
        address: address,
      });
      callback && callback(response);
      closeLoading();
      return response;
    },
    [closeLoading, isLogin, showLoading],
  );

  const { data, loading } = useRequest(() => getPointsData(walletInfo?.address || ''), {
    pollingInterval: 1000 * 60,
    refreshDeps: [walletInfo?.address, isLogin],
    onError: (err) => {
      console.error('getPointsDataError', err);
    },
  });

  return {
    data,
    loading,
    getPointsData,
  };
}
