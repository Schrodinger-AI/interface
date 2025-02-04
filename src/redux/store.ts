import { combineReducers } from 'redux';
import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import InfoReducer, { infoSlice } from './reducer/info';
import DataReducer, { dataSlice } from './reducer/data';
import UserInfoReducer, { userInfoSlice } from './reducer/userInfo';
import AssetsReducer, { assetsSlice } from './reducer/assets';
import CustomThemeReducer, { customThemeSlice } from './reducer/customTheme';
import LoginStatusReducer, { loginStatusSlice } from './reducer/loginStatus';

const rootReducer = combineReducers({
  [infoSlice.name]: InfoReducer,
  [dataSlice.name]: DataReducer,
  [userInfoSlice.name]: UserInfoReducer,
  [assetsSlice.name]: AssetsReducer,
  [customThemeSlice.name]: CustomThemeReducer,
  [loginStatusSlice.name]: LoginStatusReducer,
});

const makeStore = () => {
  const persistConfig = {
    key: 'nextjs',
    storage,
    whitelist: ['auth'], // make sure it does not clash with server keys
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: process.env.NEXT_PUBLIC_APP_ENV !== 'production',
  });

  return {
    ...store,
    __persistor: persistStore(store),
  };
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const store: AppStore = makeStore();
export const dispatch: AppDispatch = store.dispatch;
export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
