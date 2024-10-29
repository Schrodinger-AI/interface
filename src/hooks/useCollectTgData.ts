import { useEffect } from 'react';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { getTgStartParam } from 'utils/getTgStartParam';
import useTelegram from './useTelegram';

export const useCollectTgData = () => {
  const { isLogin } = useGetLoginStatus();
  const { isInTG } = useTelegram();

  const reporting = async () => {
    try {
      const { user, start_param } = getTgStartParam();
      if (!user.id) return;
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      console.log('=====getTgStartParam useCollectTgData user', user);

      const data = {
        userId: user.id,
        userName: `${user.first_name} ${user.last_name}`,
        from: start_param.activityCode || '',
        language: user.language_code,
        loginTime: currentTimestampInSeconds,
      };
      console.log('=====getTgStartParam useCollectTgData data', data);

      // TODO
      // await tgReporting(data);
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    if (!isLogin || !isInTG) return;
    reporting();
    console.log('=====getTgStartParam useCollectTgData');
  }, [isInTG, isLogin]);
};
