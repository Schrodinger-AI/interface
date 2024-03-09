import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { AppState } from 'redux/store';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useCmsInfo = () => useAppSelector((state) => state.info.cmsInfo);
