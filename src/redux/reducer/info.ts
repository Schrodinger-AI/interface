import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { InfoStateType } from 'redux/types/reducerTypes';

const initialState: InfoStateType = {
  isMobile: false,
  isSmallScreen: false,
  baseInfo: {
    rpcUrl: '',
  },
  theme: 'light',
  itemsFromLocal: [],
  joinInfo: {
    isJoin: false,
    loading: false,
  },
};

// Actual Slice
export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setItemsFromLocal(state, action) {
      // console.log('action',action)
      state.itemsFromLocal = action.payload;
    },
    setCmsInfo(state, action) {
      state.cmsInfo = action.payload;
    },
    setJoinInfo(state, action) {
      state.cmsInfo = {
        ...state.cmsInfo,
        ...action.payload,
      };
    },
    setLoginTrigger(state, action) {
      state.loginTrigger = action.payload;
    },
    setHasToken(state, action) {
      state.hasToken = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const { setIsMobile, setItemsFromLocal, setCmsInfo, setJoinInfo, setLoginTrigger, setHasToken } =
  infoSlice.actions;
export const selectInfo = (state: AppState) => state.info;
export const getJoinInfo = (state: AppState) => state.info.joinInfo;

export default infoSlice.reducer;
