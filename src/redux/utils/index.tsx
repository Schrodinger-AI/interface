import { store } from 'redux/store';
import { addPrefixSuffix } from 'utils/addressFormatting';

export const canUseWhenNoStart = (address: string) => {
  try {
    const cmsInfo = store.getState().info.cmsInfo;
    const userWhiteList = JSON.parse(cmsInfo?.userWhiteList || '[]');
    const currentAddress = addPrefixSuffix(address, cmsInfo?.curChain ?? 'tDVV');
    return userWhiteList?.includes(currentAddress);
  } catch (error) {
    return false;
  }
};
