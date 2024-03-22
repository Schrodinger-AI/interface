import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { AppState } from 'redux/store';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useCmsInfo = () => useAppSelector((state) => state.info.cmsInfo);
export const useJoinInfo = () => useAppSelector((state) => state.info.joinInfo);

export const useTxFeeStore = () => useAppSelector((state) => state.assets.txFee);
export const useTokenPriceMapStore = () => useAppSelector((state) => state.assets.tokenPriceMap);
