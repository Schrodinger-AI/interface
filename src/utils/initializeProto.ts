import { store } from 'redux/store';
import { getProto } from './deserializeLog';
import { currentRpcUrl } from 'constants/common';
import { Proto } from './proto';

const initializeProto = async (contractAddress: string) => {
  const configInfo = store.getState().info.cmsInfo;
  const sideChain = currentRpcUrl[configInfo!.curChain as Chain];

  if (configInfo?.[sideChain] && contractAddress) {
    const protoBuf = await getProto(contractAddress, configInfo?.[sideChain]);
    const proto = Proto.getInstance();
    proto.setProto(contractAddress, protoBuf);
  }
};

export default initializeProto;
