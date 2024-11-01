import { TelegramPlatform } from '@portkey/did-ui-react';

export const getTgStartParam: () => Record<string, any> = () => {
  const initData = TelegramPlatform.getInitData();

  const startParams = initData?.start_param || '';
  let userInfo;
  try {
    userInfo = initData?.user ? JSON.parse(initData.user) : {};
  } catch (error) {
    userInfo = {};
  }
  console.log('=====getTgStartParam initData', initData, userInfo);
  const paramsInfo = startParams.split('__').reduce((acc: Record<string, string>, item) => {
    const key = item.split('--')?.[0] || '';
    const value = item.split('--')?.[1];
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});
  console.log('=====getTgStartParam paramsInfo', paramsInfo);
  return {
    initData: initData,
    start_param: paramsInfo,
    user: userInfo,
  };
};
