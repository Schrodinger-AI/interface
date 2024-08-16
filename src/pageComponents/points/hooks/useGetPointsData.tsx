import { useCallback } from 'react';
import useLoading from 'hooks/useLoading';
import { getDomain } from 'utils';
import { getPoints } from 'api/request';
import { useRequest } from 'ahooks';
import { useWalletService } from 'hooks/useWallet';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';

export default function useGetPointsData() {
  const { showLoading, closeLoading } = useLoading();
  const { wallet } = useWalletService();
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

  const { data, loading } = useRequest(() => getPointsData(wallet.address), {
    pollingInterval: 1000 * 60,
    refreshDeps: [wallet.address, isLogin],
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
